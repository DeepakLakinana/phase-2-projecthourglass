import json
import http.server
import socketserver
import os
import re
import urllib.parse
from datetime import datetime
from html import escape

PORT = 8081
DB_FILE = "progress_db.json"

progress_db = {}

def load_db():
    global progress_db
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                progress_db = json.load(f)
        except (json.JSONDecodeError, OSError):
            progress_db = {}

def save_db():
    try:
        with open(DB_FILE, "w") as f:
            json.dump(progress_db, f, indent=2)
    except OSError as e:
        print(f"Warning: Could not save progress DB: {e}")

load_db()

def is_valid_team_name(name):
    return bool(name) and len(name) <= 50 and bool(re.match(r'^[a-zA-Z0-9 _-]+$', name))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_response(400)
            self.end_headers()
            return

        post_data = self.rfile.read(content_length)
        try:
            data = json.loads(post_data)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return

        if self.path == '/api/progress':
            team = data.get('team', '')
            stage = data.get('stage', '')
            completed = data.get('completed', False)

            if not is_valid_team_name(team):
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid team name. Use letters, numbers, spaces, hyphens, and underscores only."}).encode())
                return

            entry = progress_db.get(team, {
                "current_stage": "",
                "last_updated": "",
                "completed": False,
                "completed_stages": [],
            })

            entry["current_stage"] = stage
            entry["last_updated"] = datetime.now().strftime("%H:%M:%S")

            if stage and stage not in entry["completed_stages"]:
                entry["completed_stages"].append(stage)

            if completed:
                entry["completed"] = True

            progress_db[team] = entry
            save_db()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())

        elif self.path == '/api/verify':
            puzzle = data.get('puzzle', '')
            answer = data.get('answer', '').strip().upper()

            ANSWER_KEYS = {
                'r1_year': '2024',
                'r1_month': 'MAY',
                'r2_1': '6',
                'r2_2': '8',
                'r2_3': '3',
                'r2_4': '5',
                'r2_5': '5',
                'r2_6': '3',
                'r2_7': '26',
                'morse': '43.7384, 7.4206',
            }

            correct = ANSWER_KEYS.get(puzzle)
            if correct is None:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Unknown puzzle"}).encode())
                return

            match = (answer == correct)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"correct": match}).encode())

        elif self.path == '/api/abort':
            team_name = data.get('team', '')
            if team_name == '__ALL__':
                progress_db.clear()
                save_db()
            elif team_name in progress_db:
                del progress_db[team_name]
                save_db()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == '/api/progress':
            safe_db = {}
            for team, info in progress_db.items():
                safe_db[escape(team)] = {
                    "current_stage": info.get("current_stage", ""),
                    "last_updated": info.get("last_updated", ""),
                    "completed": info.get("completed", False),
                    "completed_stages": info.get("completed_stages", []),
                }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(safe_db).encode('utf-8'))

        elif self.path.startswith('/api/status?'):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            team_name = params.get('team', [''])[0]
            aborted = False
            if team_name in progress_db and progress_db[team_name].get('aborted', False):
                aborted = True
                del progress_db[team_name]
                save_db()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"aborted": aborted}).encode('utf-8'))
        else:
            super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        self.end_headers()

socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()

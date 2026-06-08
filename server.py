import json
import http.server
import socketserver
from datetime import datetime

PORT = 8081

progress_db = {}

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/progress':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                try:
                    data = json.loads(post_data)
                    team = data.get('team')
                    stage = data.get('stage')
                    completed = data.get('completed', False)
                    if team:
                        progress_db[team] = {
                            "current_stage": stage,
                            "last_updated": datetime.now().strftime("%H:%M:%S"),
                            "completed": completed
                        }
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "ok"}).encode())
                except Exception as e:
                    self.send_response(400)
                    self.end_headers()
            else:
                self.send_response(400)
                self.end_headers()
        elif self.path == '/api/abort':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            team_name = data.get('team')
            if team_name in progress_db:
                progress_db[team_name]['aborted'] = True
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == '/api/progress':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(progress_db).encode('utf-8'))
        elif self.path.startswith('/api/status?team='):
            import urllib.parse
            team_name = urllib.parse.unquote(self.path.split('=')[1])
            aborted = False
            if team_name in progress_db and progress_db[team_name].get('aborted', False):
                aborted = True
                del progress_db[team_name]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"aborted": aborted}).encode('utf-8'))
        else:
            super().do_GET()

# Allow port reuse
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()

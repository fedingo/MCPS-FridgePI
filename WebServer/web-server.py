#!/usr/bin/env python
"""
Usage::
    ./web-server.py [<host>][<port>]
    ./web-server.py [<port>]
    ./web-server.py

Send a GET request::
    curl http://localhost?foo=bar&bin=baz

Send a HEAD request::
    curl -I http://localhost

Send a POST request::
    curl -d "username=topolino&password=pippo" http://localhost:8000/fetchStorage

SendImage Request with Curl

    curl -X POST http://localhost:8000/sendImage --header "Content-Type: multipart/form-data" -F image=@web/image.jpg -F "device=cazzo"

"""
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from cgi import parse_header, parse_multipart, FieldStorage
from PIL import Image
import socketserver
import urllib.parse
import router
import json
from io import StringIO
from io import BytesIO

class S(BaseHTTPRequestHandler):
    def _set_headers(self, code=200, message=''):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(message.encode())

    def do_GET(self):

        urlparts = urllib.parse.urlparse(self.path)
        request_path = urlparts.path.strip('/')

        if request_path == 'favicon.ico':
            return

        query = urlparts.query

        if len(query) > 0:
            fields = dict(qc.split("=") for qc in query.split("&"))

        output = {}
        # Routing of the requested function
        try:
            output['result'] = router.route_request(request_path, fields)
            output['code'] = 200
            self._set_headers(200, json.dumps(output))

        except ValueError as error:
            code = error.args[0]
            message = error.args[1]
            output['code'] = code
            output['message'] = message
            self._set_headers(code, json.dumps(output))

    def do_HEAD(self):
        self._set_headers()
        self.wfile.write(b'{result : Currently supports only POST Requests}')

    def parse_POST(self):
        ctype, pdict = parse_header(self.headers['content-type'])

        if ctype == 'multipart/form-data':

            form = FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE":   self.headers['Content-Type']
            })

            postvars = {}

            for key in form.keys():

                if key == 'image':
                    fileImage = form['image'].file
                    postvars['image'] = Image.open(BytesIO(fileImage.read()))
                else:
                    if type(form[key].value)== type(b''):
                        postvars[key] = form[key].value.decode()
                    else:
                        postvars[key] = form[key].value

        elif ctype == 'application/x-www-form-urlencoded':
            length = int(self.headers['content-length'])
            data_str = self.rfile.read(length)
            fields = parse_qs(data_str, keep_blank_values=1)

            postvars = dict()
            for key in list(fields.keys()):
                postvars[key.decode()] = fields[key][0].decode()

        elif "image/" in ctype:
            length = int(self.headers['content-length'])
            im_str = self.rfile.read(length)
            image = Image.open(BytesIO(im_str))

            postvars = {'image' : image}

        else:
            postvars = {}
        return postvars

    def do_POST(self):
        # Read the called PATH
        urlparts = urllib.parse.urlparse(self.path)
        request_path = urlparts.path.strip('/')

        # Parses the POST fields
        fields = self.parse_POST()

        output = {}

        # Routing of the requested function
        try:
            output['result'] = router.route_request(request_path, fields)
            output['code'] = 200
            self._set_headers(200, json.dumps(output))

        except ValueError as error:
            code = error.args[0]
            message = error.args[1]
            output['code'] = code
            output['message'] = message
            self._set_headers(code, json.dumps(output))

def run(server_class=HTTPServer, handler_class=S,host='localhost', port=80):
    server_address = (host, port)
    httpd = server_class(server_address, handler_class)
    try:
        print("Server works on http://"+host+":"+str(port))
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Stop the server on http://"+host+":"+str(port))
        httpd.socket.close()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    elif len(argv) == 3:
        run(host = argv[1] ,port=int(argv[2]))
    else:
        run()

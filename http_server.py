from http.server import BaseHTTPRequestHandler, HTTPServer
import csv
import os
import json
from io import BytesIO

myrequestsk = None
myrequestemp = None
mystatus = None
class RequestHandler_httpd(BaseHTTPRequestHandler):
  g={"SOC":"100"}

  def do_GET(self):
    global myrequestsk
    h=json.dumps(self.g)


    print('you got this requests')
    myrequestsk = self.requestline
    print('cleaned request')
    myrequestsk = myrequestsk[5 : int(len(myrequestsk) - 9)]
    print(myrequestsk)
    messagetosend=bytes(h,"utf")
    self.send_response(200)
    self.send_header('Content-Type', 'text/plain')
    self.send_header('Content-Length', len(messagetosend))
    self.send_header('Access-Control-Allow-Origin', 'http://localhost:3001')
    self.send_header('Access-Control-Allow-Credentials', 'true')
    self.end_headers()
    self.wfile.write(messagetosend)
    return
  def do_POST(self):
      print("testing")
      content_length = int(self.headers['Content-Length'])
      body = self.rfile.read(content_length)
      self.send_response(200)
      self.end_headers()
      response = BytesIO()
      response.write(b'This is POST request. ')
      response.write(b'Received: ')
      response.write(body)
      self.wfile.write(response.getvalue())
      return 1 

server_address_httpd = ('127.0.0.1',8080)
#change this to your pc ip adress (cmd windows -ifconfig,terminal ubuntu -ipconfig)
httpd = HTTPServer(server_address_httpd, RequestHandler_httpd)
print('starting the server ')
httpd.serve_forever()

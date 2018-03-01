# run with $: python2.7 ./server.py
# The simple setup serves manifest.appcache with header: `Content-type: text/cache-manifest`
import BaseHTTPServer, SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(('localhost', 4300),
        SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.serve_forever()

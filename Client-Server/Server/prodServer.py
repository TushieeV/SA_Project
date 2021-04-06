from gevent.pywsgi import WSGIServer
from clientS import app, setup

setup()

http_server = WSGIServer(('0.0.0.0', 5000), app)
http_server.serve_forever()
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dh import DiffieHellman

app = Flask(__name__)
cors = CORS(app)

myDh = None

@app.route("/get-dh", methods=["GET"])
def get_dh():
    global myDh
    if not myDh:
        myDh = DiffieHellman()
    return jsonify({'private_key': myDh.get_private_key(), 'public_key': myDh.generate_public_key()})

@app.route("/get-shared", methods=["GET"])
def get_shared():
    global myDh
    pkey = request.args.get('pkey')
    skey = myDh.generate_shared_key(pkey)
    return jsonify({'shared': skey})


if __name__ == '__main__':
    app.run(port='6001')
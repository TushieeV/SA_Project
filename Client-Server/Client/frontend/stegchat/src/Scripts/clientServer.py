from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dh import DiffieHellman
from encrypt_decrypt import encrypt, decrypt
from txtEImg import txt_encode_img
from imgDTxt import img_decode_txt

app = Flask(__name__)
cors = CORS(app)

myDh = None
shared = None

@app.route("/get-dh", methods=["GET"])
def get_dh():
    global myDh
    if not myDh:
        myDh = DiffieHellman()
    return jsonify({'private_key': myDh.get_private_key(), 'public_key': myDh.generate_public_key()})

@app.route("/get-shared", methods=["GET"])
def get_shared():
    global myDh, shared
    pkey = request.args.get('pkey')
    shared = myDh.generate_shared_key(pkey)
    return jsonify({'shared': shared})

@app.route("/txt-E-img", methods=["GET"])
def txtEimg():
    img = request.args.get("img")
    msg = request.args.get("msg")
    seed = request.args.get("seed")
    enc_img = txt_encode_img(msg, img, seed)
    return jsonify({"encoded_image": enc_img})

@app.route("/img-D-txt", methods=["GET"])
def imgDtxt():
    img = request.args.get("img")
    seed = request.args.get("seed")
    msg = img_decode_txt(img, seed)
    return jsonify({"hidden_message": msg})

@app.route("/encrypt", methods=["GET"])
def encrypt_msg():
    global shared
    msg = request.args.get("msg")
    return jsonify({"msg": encrypt(msg, shared)})

@app.route("/decrypt", methods=["GET"])
def decrypt_msg():
    global shared
    msg = request.args.get("msg")
    return jsonify({"msg": decrypt(msg, shared)})

if __name__ == '__main__':
    app.run(port='6001')
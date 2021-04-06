from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dh import DiffieHellman
from encrypt_decrypt import encrypt, decrypt
from txtEImg import txt_encode_img
from imgDTxt import img_decode_txt
from audioEImg import wav_encode_img
from imgETxt import img_encode_txt, txt_decode_img
from imgDAudio import img_decode_audio
import logging

app = Flask(__name__)
cors = CORS(app)
log = logging.getLogger('werkzeug')
log.disabled = True

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

@app.route("/txt-E-img", methods=["POST"])
def txtEimg():
    req = request.json
    img = req['msgEncodedIn']
    msg = req['msgToEncode']
    seed = req['seed']
    enc_img = txt_encode_img(msg, img, seed)
    return jsonify({"encoded": enc_img})

@app.route("/img-E-txt", methods=["POST"])
def imgEtxt():
    req = request.json
    img = req['msgToEncode']
    msg = req['msgEncodedIn']
    seed = req['seed']
    enc_txt = img_encode_txt(img, msg, seed)
    return jsonify({"encoded": enc_txt})

@app.route("/audio-E-img", methods=["POST"])
def audioEimg():
    req = request.json
    audio = req['msgToEncode']
    img = req['msgEncodedIn']
    seed = req['seed']
    enc_img = wav_encode_img(audio, img, seed)
    return jsonify({"encoded": enc_img})

@app.route("/img-D-txt", methods=["POST"])
def imgDtxt():
    req = request.json
    img = req['img']
    seed = req['seed']
    msg = img_decode_txt(img, seed)
    return jsonify({"hidden": msg})

@app.route("/img-D-audio", methods=["POST"])
def imgDaudio():
    req = request.json
    img = req['img']
    seed = req['seed']
    audio = img_decode_audio(img, seed)
    return jsonify({"hidden": audio})

@app.route("/txt-D-img", methods=["POST"])
def txtDimg():
    req = request.json
    msg = req['msg']
    seed = req['seed']
    img = txt_decode_img(msg, seed)
    return jsonify({"hidden": img})

@app.route("/encrypt", methods=["POST"])
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
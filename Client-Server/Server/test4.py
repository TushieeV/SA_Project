import requests
from dh import DiffieHellman
from datetime import datetime
from encrypt_decrypt import xor_encrypt_decrypt, encrypt, decrypt
from PIL import Image
import numpy as np
import base64
from io import BytesIO

SIZE = 500
im = Image.open("../cutedog.jpg").resize((SIZE, SIZE)).convert('RGB')
a = np.asarray(im)

alice = DiffieHellman()
bob = DiffieHellman()

alice_shared = alice.generate_shared_key(bob.generate_public_key())
bob_shared = bob.generate_shared_key(alice.generate_public_key())

buffered = BytesIO()
im.save(buffered, format='JPEG')
img_str = base64.b64encode(buffered.getvalue())

encrypted = encrypt(img_str.decode(), alice_shared)
decrypted = decrypt(encrypted, bob_shared)

with open("imageToSave.jpg", "wb") as fh:
    fh.write(base64.decodebytes(decrypted.encode()))
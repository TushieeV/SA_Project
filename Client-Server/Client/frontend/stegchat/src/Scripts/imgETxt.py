import base64
import json
import requests
import time
from base64 import b64encode
import random

# https://i.imgur.com/{ImageID}.extension

SEED = 50

random.seed(SEED)

client_id = "76b331ddb7d5757"
client_secret = "9e6a10213b8eed1a81e7023021b717d89e295b75"

headers = {"Authorization": "Client-ID 76b331ddb7d5757"}

url = "https://api.imgur.com/3/upload.json"
url2 = "https://api.imgur.com/3/image/"

j1 = requests.post(
    url, 
    headers = headers,
    data = { 
        'image': b64encode(open('dog.jpg', 'rb').read()),
        'type': 'base64',
        'name': 'dog.jpg',
        'title': 'Picture'
    }
)

deletehash = j1.json()['data']['deletehash']
link = j1.json()['data']['link']
ID = link.split('/')[3]
msg = 'Hello'
for c in ID:
    msg += '\b' * ord(c)
    msg += '\a'
print(ID)
print(msg)


time.sleep(3)

j2 = requests.delete(
    url2 + deletehash, 
    headers = headers,
)
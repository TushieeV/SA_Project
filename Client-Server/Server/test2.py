import requests

BASE_URL = "http://127.0.0.1:5000"

while True:
    msg = input("Enter message: ")
    if msg == 'quit':
        break
    params = {"msg": msg,}
    requests.post(f"{BASE_URL}/message", params=params)
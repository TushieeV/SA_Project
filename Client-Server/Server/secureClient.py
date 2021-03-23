import requests
from dh import DiffieHellman
from datetime import datetime
from encrypt_decrypt import encrypt, decrypt

SERVER = 'http://127.0.0.1:5000/'

def do_req(endpoint, params, method):
    if method == 'GET':
        return requests.get(SERVER + endpoint, params=params).json()
    elif method == 'POST':
        return requests.post(SERVER + endpoint, params=params).json()

my_keys = DiffieHellman()
username = input("Enter username: ")
token = do_req('get-token', {'username': username}, 'GET')['token']
do_req('my-pkey', {'token': token, 'pkey': str(my_keys.generate_public_key())}, 'POST')

COMMANDS = ['message', 'get-messages', 'request', 'check-request', 'accept-request', 'my-requests', 'exit']
sessions = {}

while True:
    cmd = input('Enter command: ')
    if cmd == 'exit':
        break
    elif cmd == 'request':
        requesting = input('Who do you want to send a chat request? ')
        print(do_req('request', {'requestor': token, 'requesting': requesting}, 'POST'))
    elif cmd == 'check-request':
        req_id = input('Enter req_id:')
        print(do_req('check-request', {'req_id': req_id}, 'GET'))
    elif cmd == 'my-requests':
        print(do_req('my-requests', {'token': token}, 'GET'))
    elif cmd == 'accept-request':
        req_id = input('Enter req_id:')
        print(do_req('accept-request', {'token': token, 'req_id': req_id}, 'POST'))
    elif cmd == 'message':
        ses_id = input('Enter ses_id: ')
        msg = input('Enter message: ')
        receiver = input('Enter receiver: ')
        print(do_req('message', {'sender': token, 'receiver': receiver, 'time': str(datetime.now()), 'msg': msg, 'ses_id': ses_id}, 'POST'))
    elif cmd == 'get-messages':
        ses_id = input('Enter ses_id: ')
        res = do_req('get-messages', {'ses_id': ses_id}, 'GET')
        for m in res['messages']:
            print(m['sender'] + ': ' + m['msg'])
    else:
        print('Invalid command')

    


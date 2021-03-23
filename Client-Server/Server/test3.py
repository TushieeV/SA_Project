import requests
from dh import DiffieHellman
from datetime import datetime
from encrypt_decrypt import xor_encrypt_decrypt, encrypt, decrypt

BASE_URL = 'http://127.0.0.1:5000/'

a = DiffieHellman()
b = DiffieHellman()

a_tok = requests.get(BASE_URL + 'get-token', params={'username': 'a'})
print(a_tok.json())

b_tok = requests.get(BASE_URL + 'get-token', params={'username': 'b'})
print(b_tok.json())

a_send_pkey = requests.post(BASE_URL + 'my-pkey', params={'token': a_tok.json()['token'], 'pkey': str(a.generate_public_key())})
print(a_send_pkey.json())

b_send_pkey = requests.post(BASE_URL + 'my-pkey', params={'token': b_tok.json()['token'], 'pkey': str(b.generate_public_key())})
print(b_send_pkey.json())

a_req_b = requests.post(BASE_URL + 'request', params={'requestor': a_tok.json()['token'], 'requesting': 'b'})
print(a_req_b.json())

b_req_a = requests.post(BASE_URL + 'request', params={'requestor': b_tok.json()['token'], 'requesting': 'a'})
print(b_req_a.json())

b_requests = requests.get(BASE_URL + 'my-requests', params={'token': b_tok.json()['token']})
print(b_requests.json())

a_req_status = requests.get(BASE_URL + 'check-request', params={'req_id': a_req_b.json()['req_id'], 'token': a_tok.json()['token']})
print(a_req_status.json())

b_accept_a_req = requests.post(BASE_URL + 'accept-request', params={'req_id': a_req_b.json()['req_id'], 'token': b_tok.json()['token']})
print(b_accept_a_req.json())

a_req_status = requests.get(BASE_URL + 'check-request', params={'req_id': a_req_b.json()['req_id'], 'token': a_tok.json()['token']})
print(a_req_status.json())

a_get_b_pkey = requests.get(BASE_URL + 'get-pkey', params={'ses_id': a_req_status.json()['ses_id'], 'target': 'b'})
print(a_get_b_pkey.json())

b_get_a_pkey = requests.get(BASE_URL + 'get-pkey', params={'ses_id': b_accept_a_req.json()['ses_id'], 'target': 'a'})
print(b_get_a_pkey.json())

a_shared = a.generate_shared_key(a_get_b_pkey.json()['pkey'])
b_shared = b.generate_shared_key(b_get_a_pkey.json()['pkey'])
print(a_shared)
print(b_shared)
print(a_shared == b_shared)

msg = 'Hello'
encrypted_msg = encrypt('Hello', a_shared)
a_msg_b = requests.post(BASE_URL + 'message', params={'ses_id': a_req_status.json()['ses_id'], 'sender': a_tok.json()['token'], 'receiver': 'b', 'msg': encrypted_msg, 'time': str(datetime.now())})
print(a_msg_b.json())

b_get_msgs = requests.get(BASE_URL + 'get-messages', params={'ses_id': b_accept_a_req.json()['ses_id']})
print(b_get_msgs.json())
decrypted_msg = decrypt(b_get_msgs.json()['messages'][0]['msg'], b_shared)
print("Decrypted: " + decrypted_msg)


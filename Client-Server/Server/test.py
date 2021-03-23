import requests

BASE_URL = "http://127.0.0.1:5000"  # assuming the server is running locally

alice = requests.get(f"{BASE_URL}/generate-keys").json()
alice_private, alice_public = alice["private_key"], alice["public_key"]

bob = requests.get(f"{BASE_URL}/generate-keys").json()
bob_private, bob_public = bob["private_key"], bob["public_key"]

alice_params = {"local_private_key": alice_private, "remote_public_key": bob_public}
bob_params = {"local_private_key": bob_private, "remote_public_key": alice_public}

alice_shared_key = requests.get(
    f"{BASE_URL}/generate-shared-key", params=alice_params
).json()["shared_key"]
bob_shared_key = requests.get(
    f"{BASE_URL}/generate-shared-key", params=bob_params
).json()["shared_key"]

# alice and bob have access to the same shared key
assert alice_shared_key == bob_shared_key
print(alice_shared_key)
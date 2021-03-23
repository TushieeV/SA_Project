from PIL import Image  
import base64 

with open('blank_user_icon.png', 'rb') as img:
    encoded_string = base64.b64encode(img.read())
    print(encoded_string.decode())

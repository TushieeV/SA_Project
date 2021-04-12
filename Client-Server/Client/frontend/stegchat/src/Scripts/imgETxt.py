import random

# Given a number returns its size-bit binary string
def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

# img: base64 string, txt: string, seed: string or number
def img_encode_txt(img, txt, seed):
    random.seed(seed)
    cipher = ''
    for c in img:
        encStr = binArr(ord(c), 7).replace('0', '\a').replace('1', '\b')
        cipher += encStr
    l = list(range(len(cipher)))
    random.shuffle(l)
    shuffled_cipher = ''.join([cipher[x] for x in l])
    txt += shuffled_cipher
    return txt

# txt: string, seed: string or number
def txt_decode_img(txt, seed):
    random.seed(seed)
    shuffled_cipher = ''.join([c for c in txt if c == '\a' or c == '\b'])
    l = list(range(len(shuffled_cipher)))
    random.shuffle(l)
    out = [None] * len(shuffled_cipher)
    for i, x in enumerate(l):
        out[x] = shuffled_cipher[i]
    out = ''.join(out)
    dec = ''
    for i in range(0, len(out), 7):
        binStr = ''.join(['0' if x == '\a' else '1' for x in out[i:i+7]])
        dec += chr(int(binStr, 2))
    return dec

import numpy as np
from scipy.io.wavfile import read, write
import struct
import random
from PIL import Image
import math
from io import BytesIO
import base64

def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

def changeLastBits(num, bits, size, n):
    if type(num) is np.float32:
        b = float_to_bin(num)
    else:
        b = binArr(num, size)
    n = "".join([b[i] for i in range(len(b) - n)])
    for bit in bits:
        if bit == 0:
            n += '0'
        else:
            n += '1'
    return n

def float_to_bin(num):
    return format(struct.unpack('!I', struct.pack('!f', num))[0], '032b')

def bin_to_float(binary):
    return struct.unpack('!f',struct.pack('!I', int(binary, 2)))[0]

def txt_encode_audio(msg, audio, seed):

    random.seed(seed)

    f = open('temp.wav', 'wb')
    f.write(base64.b64decode(audio))
    f.close()

    s, a = read('temp.wav')

    msgNum = np.array([ord(c) for c in msg])

    xs = [x for x in range(len(a))]
    lngth = len(xs) - 1

    b = binArr(len(msg), 14)
    for i in range(len(b)):
        idx = random.randint(min(xs), lngth)
        r = changeLastBits(a[idx][0], [int(b[i])], 32, 1)
        a[idx][0] = bin_to_float(r)
        xs.remove(idx)
        lngth -= 1 

    for i in range(len(msg)):
        b = binArr(msgNum[i], 7)
        for j in range(len(b)):
            idx = random.randint(min(xs), lngth)
            r = changeLastBits(a[idx][0], [int(b[j])], 32, 1)
            a[idx][0] = bin_to_float(r)
            xs.remove(idx)
            lngth -= 1

    write('temp.wav', 44100, a)
    
    f = open('temp.wav', 'rb')
    b64 = base64.b64encode(f.read()).decode()
    f.close()
    return b64

    

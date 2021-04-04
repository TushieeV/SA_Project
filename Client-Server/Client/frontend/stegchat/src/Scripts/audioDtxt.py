import numpy as np
from scipy.io.wavfile import read, write
import struct
import random
from PIL import Image
import math

SEED = 'feafaewoijf'
MSG_MAX = 2500

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

random.seed(SEED)

s, a = read('encodedTextAudio.wav')

xs = [x for x in range(len(a))]
lngth = len(xs) - 1

b = ''
for _ in range(14):
    idx = random.randint(min(xs), lngth)
    b += float_to_bin(a[idx][0])[-1]
    lngth -= 1
    xs.remove(idx)

msg_len = int(b, 2)
if msg_len > 10000:
    msg_len = random.randint(0, 10000)
msg = ''

for _ in range(msg_len):
    b = ''
    for _ in range(7):
        idx = random.randint(min(xs), lngth)
        b += float_to_bin(a[idx][0])[-1]
        lngth -= 1
        xs.remove(idx)
    msg += chr(int(b, 2))

print(msg[0:-1])
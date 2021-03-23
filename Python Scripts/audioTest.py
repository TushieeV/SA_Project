import sounddevice as sd
import scipy as sp
import numpy as np
from scipy.io.wavfile import read, write
from scipy import signal
import matplotlib.pyplot as plt
from PIL import Image
import struct

def float_to_bin(num):
    return format(struct.unpack('!I', struct.pack('!f', num))[0], '032b')

def bin_to_float(binary):
    return struct.unpack('!f',struct.pack('!I', int(binary, 2)))[0]

def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

fs, rec = read('output.wav')

SIZE = 370
pixels = np.zeros((SIZE, SIZE, 4))

count = 0
for x in range(SIZE):
    for y in range(SIZE):
        if count >= len(rec):
            break
        num = sum(rec[count])/2
        b = float_to_bin(num)
        if int(b[24:32], 2) > 0:
            print('True')
        pixels[x][y] = [int(b[0:8], 2), int(b[8:16], 2), int(b[16:24], 2), 255]
        count += 1
    if count >= len(rec):
        break

img = Image.fromarray(np.uint8(pixels))
img.save('audioEncoded.png')

a = np.asarray(Image.open('audioEncoded.png'))

newAudio = np.zeros((rec.shape))
count = 0
for x in a:
    for y in x:
        if count >= len(rec):
            break
        currF = binArr(y[0], 8) + binArr(y[1], 8) + binArr(y[2], 8) + '00000000'
        newAudio[count] = [bin_to_float(currF), bin_to_float(currF)]
        count += 1
    if count >= len(rec):
        break

write('test.wav', fs, np.asarray(newAudio, dtype=np.float32))
        


import numpy as np
from scipy.io.wavfile import read, write
import struct
import random
from PIL import Image
import math

SEED = 50
SIZE = 2500
#nSlots = 32
nSlots = 4

def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

def changeLastBits(num, bits, size, n):
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

def getLastBits(num, size, n):
    b = binArr(num, size)
    return b[len(b)-n:len(b)]

random.seed(SEED)

img = Image.open("encodedAudio.png").convert("RGB")
a = np.asarray(img)

lenStartY = random.randint(0, SIZE - 21)
num = ''
for i in range(lenStartY, lenStartY + 21):
    num += getLastBits(a[SIZE - 1][i][0], 8, 1)

length = int(num, 2)

print(length)

if length >= int((SIZE * SIZE) / nSlots):
    length = random.randint(0, int((SIZE * SIZE) / nSlots) - 1)



audio = np.zeros((length, 2), dtype=float)

slotC = [(i, j) for i in range(0, SIZE - nSlots, nSlots) for j in range(SIZE)]
chosenSlots = random.sample(slotC, length)

#for k in range(length):
k = 0
for c in chosenSlots:
    #c = random.choice(slotC)
    (x, y) = c
    #slotC.remove(c)
    currF = ''
    for i in range(x, x + nSlots):
        currF += getLastBits(a[i][y][0], 8, 4) + getLastBits(a[i][y][1], 8, 4)
        #currF += getLastBits(a[i][y][0], 8, 3) + getLastBits(a[i][y][1], 8, 3) + getLastBits(a[i][y][2], 8, 3)
    audio[k] = [round(bin_to_float(currF), 3), round(bin_to_float(currF), 3)]
    k += 1

audio = np.asarray(audio, dtype=np.float32)

write("decodedAudio.wav", 44100, audio)


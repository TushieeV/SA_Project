from PIL import Image, ImageDraw
import numpy as np
import random

SEED = 50
SIZE = 500

def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

def getLastBit(num, size):
    b = binArr(num, size)
    return b[len(b) - 1]

random.seed(SEED)

im = Image.open('encoded.png').convert('RGB')
a = np.asarray(im)

pixels = np.zeros(a.shape)

lenStartY = random.randint(0, SIZE - 14)
num = ''
for i in range(lenStartY, lenStartY + 14):
    num += getLastBit(a[SIZE - 1][i][0], 8)

length = int(num, 2)

allCoords = [(x, y) for x in range(SIZE - 1) for y in range(SIZE)]
charSlots = random.sample(allCoords, length * 7)

msg = ''
for i in range(0, len(charSlots), 7):
    currC = ''
    for c in charSlots[i:i+7]:
        (x, y) = c
        currC += getLastBit(a[x][y][0], 8)
    msg += chr(int(currC, 2))

print(msg)

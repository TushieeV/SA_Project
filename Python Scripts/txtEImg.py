from PIL import Image, ImageDraw
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
import random
import sys

SEED = 50
SIZE = 500

def binArr(num, size):
    b = "{0:b}".format(num)
    if len(b) != size:
        tmp = '0' * (size - len(b))
        tmp += b
        b = tmp
    return b

def changeLastBit(num, bit, size):
    b = binArr(num, size)
    n = "".join([b[i] for i in range(len(b) - 1)])
    if bit == 0:
        n += '0'
    else:
        n += '1'
    return n

random.seed(SEED)

#msg = input("Enter message to encode: ")
msg = sys.argv[1]
im = Image.open("cutedog.jpg").resize((SIZE, SIZE)).convert('RGB')
a = np.asarray(im)

count = 0
msgNum = np.array([ord(c) for c in msg])

pixels = np.zeros(a.shape)

lenStartY = random.randint(0, SIZE - 14)
lenCoords = []
b = binArr(len(msg), 14)
j = 0
for i in range(lenStartY, lenStartY + 14):
    r = changeLastBit(a[SIZE - 1][i][0], int(b[j]), 8)
    pixels[SIZE - 1][i] = [int(r, 2), a[SIZE - 1][i][1], a[SIZE - 1][i][2]]
    lenCoords.append((SIZE - 1, i))
    j += 1

allCoords = [(x, y) for x in range(SIZE - 1) for y in range(SIZE)]
charSlots = random.sample(allCoords, len(msgNum) * 7)

filledCoords = []
count = 0
for i in range(0, len(charSlots), 7):
    c = msg[count]
    b = binArr(ord(c), 7)
    j = 0
    for c in charSlots[i:i+7]:
        (x, y) = c
        r = changeLastBit(a[x][y][0], int(b[j]), 8)
        pixels[x][y] = [int(r, 2), a[x][y][1], a[x][y][2]]
        filledCoords.append(c)
        j += 1
    count += 1

for x in range(SIZE):
    for y in range(SIZE):
        if (x, y) not in filledCoords and (x, y) not in lenCoords:
            pixels[x][y] = [a[x][y][0], a[x][y][1], a[x][y][2]]

img = Image.fromarray(np.uint8(pixels))
#img.show()
img.save("encoded.png")

'''
    Show graphs for when the transparency is chosen between the following:
        - Average (sum(msgNum)/len(msgNum))
        - Random (min(msgNum) - max(msgNum))
        - Random (np.percentile(25, msgNum), np.percentile(75, msgNum))

'''

#plt.plot(pixels[:,:,0])
#plt.show()
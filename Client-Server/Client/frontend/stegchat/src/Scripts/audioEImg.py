import numpy as np
from scipy.io.wavfile import read, write
import struct
import random
from PIL import Image
import math
import base64
from io import BytesIO

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

def wav_encode_img(wav, img, seed):

    f = open('temp.wav', 'wb').write(base64.b64decode(wav))

    s, a = read('temp.wav')

    if a.dtype != np.float32:
        a = a.astype(np.float32) / 2**15

    SIZE = 2500

    bitExp = 32

    nFlipped = 4
    channels = 2
    nSlots = math.ceil(bitExp/(nFlipped*channels))

    random.seed(seed)

    im = Image.open(BytesIO(base64.b64decode(img))).resize((SIZE, SIZE)).convert('RGB')
    imgArr = np.asarray(im)

    pixels = np.zeros(imgArr.shape)
    for x in range(SIZE):
        for y in range(SIZE):
            pixels[x][y] = imgArr[x][y]
    allCoords = [(x, y) for x in range(SIZE) for y in range(SIZE)]

    lenStartY = random.randint(0, SIZE - 21)
    lenCoords = []
    b = binArr(len(a), 21)
    j = 0
    for i in range(lenStartY, lenStartY + 21):
        r = changeLastBits(imgArr[SIZE - 1][i][0], [int(b[j])], 8, 1)
        pixels[SIZE - 1][i] = [r, imgArr[SIZE - 1][i][1], imgArr[SIZE - 1][i][2]]
        j += 1

    slotC = [(i, j) for i in range(0, SIZE - nSlots, nSlots) for j in range(SIZE)]
    chosenSlots = random.sample(slotC, len(a))

    count = 0
    #for k in range(len(a)):
    for c in chosenSlots:
        #c = random.choice(slotC)
        #slotC.remove(c)
        (x, y) = c
        c = sum(a[count])/2
        b = float_to_bin(c)
        #b = binArr(c, 16)
        j = 0
        for i in range(x, x + nSlots):
            r = changeLastBits(imgArr[i][y][0], [int(k) for k in b[j:j+nFlipped]], 8, nFlipped)
            j += nFlipped
            g = changeLastBits(imgArr[i][y][1], [int(k) for k in b[j:j+nFlipped]], 8, nFlipped)
            j += nFlipped
            #b = changeLastBits(imgArr[i][y][2], [int(k) for k in b[j:j+nFlipped]], 8, nFlipped)
            #j += nFlipped
            
            pixels[i][y] = [int(r, 2), int(g, 2), imgArr[i][y][2]]
            #pixels[i][y] = [int(r, 2), int(g, 2), int(b, 2)]
            
            #o = changeLastBits(imgArr[i][y][3], [int(k) for k in b[j:j+nFlipped]], 8, nFlipped)
            #j += nFlipped
            #pixels[i][y] = [imgArr[i][y][0], imgArr[i][y][1], imgArr[i][y][2], int(o, 2)]
            #o = changeLastBits(imgArr[i][y][3], [int(k) for k in b[j:j+nFlipped]], 8, nFlipped)
            #j += nFlipped
            #pixels[i][y] = [int(r, 2), int(g, 2), int(b, 2), int(o, 2)]
            #pixels[i][y] = [int(r, 2), int(g, 2), int(b, 2)]
            #filledCoords.append((i, y))
            #allCoords.remove((i, y))
        count += 1

    img = Image.fromarray(np.uint8(pixels))
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    open('tempb64', 'w+').write(img_str)
    return img_str
    #img.show()
    #img.save("encodedAudio.png")



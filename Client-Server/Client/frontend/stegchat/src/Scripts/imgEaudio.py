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

def img_encode_audio(img, audio, seed):
    random.seed(seed)
    
    f = open('temp.wav', 'wb').write(base64.b64decode(audio))
    s, a = read('temp.wav')

    if a.dtype != np.float32:
        a = a.astype(np.float32) / 2**15

    a = np.array([x for x in a])

    im = Image.open(BytesIO(base64.b64decode(img))).resize((300, 300)).convert('RGB')
    imgArr = np.asarray(im)

    print(imgArr.shape)

    rands = random.sample([x for x in range(len(a))], 300 * 300)

    #for i, pixel in enumerate(imgArr):
        #print(pixel)
    count = 0   
    for x in range(300):
        for y in range(300):
            avg = math.ceil(np.mean(imgArr[x][y]))
            b = binArr(avg, 8)
            binF1 = float_to_bin(a[rands[count]][0])
            binF2 = float_to_bin(a[rands[count]][1])
            a[rands[count]][0] = bin_to_float(binF1[0:28] + b[0:4])
            a[rands[count]][1] = bin_to_float(binF2[0:28] + b[4:8])
            count += 1

    write('temp.wav', 44100, a)
    return base64.b64encode(open('temp.wav', 'rb').read()).decode()

def audio_decode_img(audio, seed):
    random.seed(seed)

    f = open('temp.wav', 'wb').write(base64.b64decode(audio))
    s, a = read('temp.wav')

    pixels = np.zeros((300, 300, 3))

    rands = random.sample([x for x in range(len(a))], 300 * 300)

    count = 0
    for x in range(300):
        for y in range(300):
            pixel = int(float_to_bin(a[count][0])[28:32] + float_to_bin(a[count][1])[28:32], 2)
            pixels[x][y] = [pixel, pixel, pixel]
            count += 1

    img = Image.fromarray(np.uint8(pixels))
    img.show()
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

if __name__ == '__main__':
    audio = open('audio', 'r').read()
    audio_decode_img(audio, 'theway007')

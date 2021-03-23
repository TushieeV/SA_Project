import numpy as np
from scipy.io.wavfile import read, write
import simpleaudio as sa
import struct
from PIL import Image

def float_to_bin(num):
    return format(struct.unpack('!I', struct.pack('!f', num))[0], '032b')

def bin_to_float(binary):
    return struct.unpack('!f',struct.pack('!I', int(binary, 2)))[0]

fs = 44100

s, a = read('output.wav')

t = np.zeros(a.shape, dtype=float)
for i in range(len(a)):
    t[i] = [sum(a[i])/len(a[i]), sum(a[i])/len(a[i])]

write('output2.wav', fs, np.asarray(t, dtype=np.float32))

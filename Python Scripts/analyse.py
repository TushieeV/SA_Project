import sounddevice as sd
import scipy as sp
import numpy as np
from scipy.io.wavfile import read, write
from scipy import signal
import matplotlib.pyplot as plt

fs = 44100
seconds = 3

fs, rec = read('output.wav')

data = rec[0:2000]
time = np.linspace(0, len(data) / fs, num=len(data))

fhat = np.fft.fft(data, len(data))
PSD = fhat * np.conj(fhat) / len(data)

thresh = np.max(PSD) / 1.5

newRec = np.zeros(rec.shape)
for i in range(len(rec)):
    if rec[i][0] >= thresh:
        newRec[i] = [rec[i][0], rec[i][1]]
    else:
        newRec[i] = [0, 0]

write('test.wav', fs, np.asarray(newRec, dtype=np.float32))
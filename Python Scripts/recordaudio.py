import sounddevice as sd
import scipy as sp
import numpy as np
from scipy.io.wavfile import write
from scipy import signal

fs = 44100  # Sample rate
seconds = 3  # Duration of recording

myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
sd.wait()  # Wait until recording is finished

print(len(myrecording))

write('output.wav', fs, myrecording)  # Save as WAV file 
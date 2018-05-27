
#!/usr/bin/python
from picamera import PiCamera
from time import sleep
import sys
from sendimage import *


ip = sys.argv[1]
dev = sys.argv[2]

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.IN)
GPIO.setup(31,GPIO.OUT)
GPIO.output(31,0)
camera = PiCamera()

while True:
        while GPIO.input(7) != 0:
                if GPIO.input(7) == 0:
                        GPIO.output(31,1)
                        time.sleep(3)

                        camera.start_preview()
                        sleep(3)
                        camera.capture('./image.jpg')
                        camera.stop_preview()

                        print('immagine fatta')
                        sleep(3)

                        print('invio immagine')
                        send(ip,dev)
                        print('immagine inviata')
                        GPIO.output(31,0)


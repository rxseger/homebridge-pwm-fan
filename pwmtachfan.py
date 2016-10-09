#!/usr/bin/python -u
# tachfan.py - read RPM from a PC fan tachometer wired to GPIO
#
# references:
# http://electronics.stackexchange.com/questions/8295/how-to-interpret-the-output-of-a-3-pin-computer-fan-speed-sensor
# http://www.formfactors.org/developer/specs/REV1_2_Public.pdf

import time
import pigpio

TACH = 16    # BCM 16 / physical #36
PWM_BCM = 23 # BCM 23 / physical #16

pi = pigpio.pi() # sudo pigpiod

pi.set_mode(TACH, pigpio.INPUT)
pi.set_pull_up_down(TACH, pigpio.PUD_UP)

t = time.time()
def fell(gp, level, tick):
	global t
	dt = time.time() - t
	if dt < 0.01: return # reject spuriously short pulses

	freq = 1 / dt
	rpm = (freq / 2) * 60
	print "%.f" % (rpm,)
	t = time.time()	

pi.callback(TACH, pigpio.FALLING_EDGE, fell)

frequency = 1
#dutycycle = 0.50
dutycycle = 0.996
#dutycycle = 1.0
pi.set_PWM_frequency(PWM_BCM, frequency)
pi.set_PWM_dutycycle(PWM_BCM, dutycycle * 255)

while True: time.sleep(1e9)


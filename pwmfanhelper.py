#!/usr/bin/python -u
# pwmfanhelper.py - read RPM from a PC fan tachometer wired to GPIO, control via PWM
#
# Why this Python helper script instead of pure Node.js?
#
# 1. https://www.npmjs.com/package/pigpio requires running as root (unsuitable for Homebridge plugin), doesn't use daemon
#  see https://github.com/fivdi/pigpio/issues/2
# 2. https://www.npmjs.com/package/pi-fast-gpio uses pigpiod daemon, but doesn't implement interrupts or anything but PWM
# 3. https://www.npmjs.com/package/pigpio.js similar to pi-fast-gpio, also has missing functionality
#
# TODO: a Node.js/JavaScript module to talk to pigpiod comprehensively, to replace this Python
#
# references:
# http://electronics.stackexchange.com/questions/8295/how-to-interpret-the-output-of-a-3-pin-computer-fan-speed-sensor
# http://www.formfactors.org/developer/specs/REV1_2_Public.pdf

import time
import pigpio
import sys

if len(sys.argv) < 4:
	sys.stderr.write("""usage: %s tach_bcm pwm_bcm frequency dutycycle

tach_pwm: tachometer pin, Broadcom number [ex: 16]
pwm_pwm: pulse-width control pin or fan power, Broadcom number [ex: 23]
frequency: PWM frequency (Hz) [ex: 1]
dutycycle: PWM duty cycle (0.0 - 1.0) [ex: 0.996]

Outputs RPM read from tachometer on stdout, one per line

Example:

%s 16 23 1 0.996
""" % (sys.argv[0], sys.argv[0]))
	raise SystemExit

TACH_BCM = int(sys.argv[1])
PWM_BCM = int(sys.argv[2])
frequency = int(sys.argv[3])
dutycycle = float(sys.argv[4])

pi = pigpio.pi() # sudo pigpiod

pi.set_mode(TACH_BCM, pigpio.INPUT)
pi.set_pull_up_down(TACH_BCM, pigpio.PUD_UP)

t = time.time()
def fell(gp, level, tick):
	global t
	dt = time.time() - t
	if dt < 0.01: return # reject spuriously short pulses

	freq = 1 / dt
	rpm = (freq / 2) * 60
	print "%.f" % (rpm,)
	t = time.time()	

pi.callback(TACH_BCM, pigpio.FALLING_EDGE, fell)

pi.set_PWM_frequency(PWM_BCM, frequency)
pi.set_PWM_dutycycle(PWM_BCM, dutycycle * 255)

while True: time.sleep(1e9)


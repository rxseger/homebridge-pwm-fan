# homebridge-pwm-fan

(Incomplete/broken) - the beginning of an attempt at a [Homebridge](https://github.com/nfarina/homebridge) plugin to control 3/4-wire PC fans using Raspberry Pi GPIO, based on:

* [tachfan.py](https://gist.github.com/rxseger/2b27e661221b6f350b859d13f256cf29) - reading fan RPM using tachometer pulses from GPIO interrupts
* [pwmtachfan.py](https://gist.github.com/rxseger/d6894e37e57df12fb1dd002d4b8dc6d2) - adjusting PWM duty cycle to adjust fan speed

Currently broken, notes on failed attempts and why:

* Using [pigpio](https://www.npmjs.com/package/pigpio): requires running as root ([can't chmod](https://github.com/fivdi/pigpio/issues/2)), a problem for Homebridge plugins since this would require the user to run Homebridge as root which may have unintended consequences - the plugin really ought to not require running as root
* Using [pi-fast-gpio](https://www.npmjs.com/package/pi-fast-gpio): this uses the pigpiod daemon, solving the root issue, but it lacks complete functionality, only supports PWM
* [pigpio.js](https://www.npmjs.com/package/pigpio.js) - similar to pi-fast-gpio, except CoffeeScript and broken source link

TODO: find or write a complete pigpiod daemon interface library for Node.js, this would unblock development of homebridge-pwm-fan.
The techniques are there (prototyped in Python), just need to be ported over to JavaScript for running in a Homebridge plugin.


## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g homebridge-pwm-fan`
3.	Update your configuration file - see below for an example

## Wiring diagram

## Configuration
* `accessory`: "PWMFan"
* `name`: descriptive name

Example configuration:

```json
    "accessories": [
        {
            "accessory": "PWMFan",
            "name": "Desk Fan"
        }
    ]
```

## License

MIT


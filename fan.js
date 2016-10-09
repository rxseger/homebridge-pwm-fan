'use strict';

const Gpio = require('pigpio').Gpio;

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-gpio-fan', 'PWMFan', FanPlugin);
};

class FanPlugin
{
  constructor(log, config) {
    this.log = log;
    this.name = config.name;

    this.tachometer = new Gpio(16, { // physical #36, BCM 16
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      edge: Gpio.FALLING_EDGE
    });
    this.rpm = 0;
    this.last_tach = process.hrtime();
    this.tachometer.on('interrupt', this.onTachometer.bind(this));

    this.motor = new Gpio(23, { // physical #16, BCM 23
      mode: Gpio.OUTPUT
    });
    const dutycycle = 0.996;
    //const dutycycle = 1.0;
    this.motor.pwmFrequency(1); // to reduce impact on tach circuitry on 3-wire fans
    this.motor.pwmWrite(Math.round(dutycycle * 255));


setInterval( () => {}, 1000);
return;

    this.fan = new Service.Fan(this.name);
    this.fan
      .getCharacteristic(Characteristic.On)
      .on('get', this.getOn.bind(this));
    this.fan
      .getCharacteristic(Characteristic.RotationSpeed)
      .on('get', this.getRotationSpeed.bind(this))
      .on('set', this.setRotationSpeed.bind(this));
  }

  onTachometer() {
    const difference = process.hrtime(this.last_tach);
    const dt = difference[0] + difference[1] / 1e9; // s + ns --> in seconds
    if (dt < 0.02) return; // reject spuriously short pulses
 
    const freq = 1 / dt;
    const rpm = (freq / 2) * 60;
    console.log(rpm);
    this.last_tach = process.hrtime();
  }

  getOn(cb) {
    const on = this.rpm > 0;
    cb(null, on);
  }

  getRotatonSpeed(cb) {
    cb(null, this.rpm);
  }

  setRotationSpeed(speed, cb) {
    console.log('setRotationSpeed',speed);
    // TODO: better translate target RPM to PWM duty cycle
    let dutycycle = 1.0;
    if (speed < 500) {
      dutycycle = 0.996;
    }
    console.log('dutycycle',dutycycle);
    this.motor.pwmWrite(dutycycle);
  }

  getServices() {
    return [this.fan];
  }
}

new FanPlugin({}, {});

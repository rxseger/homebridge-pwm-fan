'use strict';

const child_process = require('child_process');
const path = require('path');
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

    this.tach_bcm = 16;  // physical #36, BCM 16
    this.motor_bcm = 23; // physical #16, BCM 23

    this.frequency = 1;
    this.dutycycle = 255; // 0-255 = 0%-100%

    this.helper = null;
    this.helperPath = path.join(__dirname, 'pwmfanhelper.py');
    this._relaunchHelper();

    this.fan = new Service.Fan(this.name);
    this.fan
      .getCharacteristic(Characteristic.On)
      .on('get', this.getOn.bind(this));
    this.fan
      .getCharacteristic(Characteristic.RotationSpeed)
      .on('get', this.getRotationSpeed.bind(this))
      .on('set', this.setRotationSpeed.bind(this));
  }

  // Relaunch the Python helper process, possibly with new arguments
  _relaunchHelper() {
    if (this.helper) {
      this.helper.kill();
      // TODO: more cleanup needed?
    }
 
    this.helper = child_process.spawn('python', ['-u', this.helperPath, this.tach_bcm, this.motor_bcm, this.frequency, this.dutycycle])

    this.helper.stderr.on('data', (err) => {
      throw new Error(`pwmfanhelper error: ${err}`);
    });

    this.helper.stdout.on('data', (data) => {
      this.rpm = parseInt(data);
      //console.log(`rpm: ${this.rpm}`);
    });
  }

  getOn(cb) {
    const on = this.rpm > 0;
    cb(null, on);
  }

  getRotationSpeed(cb) {
    cb(null, this.rpm);
  }

  setRotationSpeed(speed, cb) {
    // speed given is a number 100 (full power) to 0
    //console.log('setRotationSpeed',speed);
    // scale speed by duty cycle
    this.dutycycle = 0|(speed / 100 * 255);
    //console.log('dutycycle',this.dutycycle);
    this._relaunchHelper();

    cb(null);
  }

  getServices() {
    return [this.fan];
  }
}

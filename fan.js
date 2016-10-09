'use strict';

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-gpio-fan', 'GPIOFan', FanPlugin);
};

class FanPlugin
{
  constructor(log, config) {
    this.log = log;
    this.name = config.name;

    this.fan = new Service.Fan(this.name);
    this.fan
      .getCharacteristic(Characteristic.On)
      .on('get', this.getOn.bind(this));
    this.fan
      .getCharacteristic(Characteristic.RotationSpeed)
      .on('get', this.getRotationSpeed.bind(this))
      .on('set', this.setRotationSpeed.bind(this));
  }

  getOn(cb) {
    // TODO
  }

  getRotatonSpeed(cb) {
    // TODO
  }

  setRotationSpeed(speed, cb) {
    // TODO
  }

  getServices() {
    return [this.fan];
  }
}


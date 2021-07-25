"use strict";

const setup = (homebridge) => {
  homebridge.registerAccessory(
    "homebridge-esp8266-dht22",
    "ESP8266DHT22",
    ESP8266DHT22
  );
};

class ESP8266DHT22 {
  constructor(log, config, api) {
    log("ESP8266DHT22 Start!");
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.name = config.name;
    this.ip = config.ip;
    this.log(`Name : ${this.name}, IP : ${this.ip}`);

    this.temperatureService = new this.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));
  }

  handleCurrentTemperatureGet() {
    this.log.debug("Triggered GET CurrentTemperature");

    // GET Temperature Data
    const currentValue = 26;

    return currentValue;
  }

  getServices() {
    return [this.temperatureService];
  }
}

module.exports = setup;

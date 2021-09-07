'use strict';

import axios from 'axios';

const setup = (homebridge) => {
  homebridge.registerAccessory(
    'homebridge-esp8266-dht-sensor',
    'ESP8266DHT',
    ESP8266DHT
  );
};
class ESP8266DHT {
  constructor(log, config, api) {
    log('ESP8266DHT Start!');
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.name = config.name;
    this.ip = config.ip;
    this.log(`Name : ${this.name}, IP : ${this.ip}`);

    this.sensorData = {
      temperature: 0,
      humidity: 0,
    };
    this.getSensorData();

    this.temperatureService = new this.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));

    this.humidityService = new this.Service.HumiditySensor(this.name);

    this.humidityService
      .getCharacteristic(this.Characteristic.CurrentRelativeHumidity)
      .onGet(this.handleCurrentRelativeHumidityGet.bind(this));
  }

  handleCurrentTemperatureGet() {
    this.log('Triggered GET CurrentTemperature');
    this.getSensorData();

    return this.sensorData.temperature;
  }

  handleCurrentRelativeHumidityGet() {
    this.log('Triggered GET CurrentHumidity');
    return this.sensorData.humidity;
  }

  async getSensorData() {
    this.log('Axios', this.ip);

    const refineData = (data) => {
      return JSON.parse(data.replace(/&quot;/g, '"'));
    };

    try {
      const { data } = await axios.get(`http://${this.ip}`);

      this.sensorData = refineData(data);
    } catch (error) {
      this.log(error);
    }
  }

  getServices() {
    return [this.temperatureService, this.humidityService];
  }
}

module.exports = setup;

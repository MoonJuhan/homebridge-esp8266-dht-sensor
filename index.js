'use strict';

const axios = require('axios');

const { _auth, authorize, callAppsScript } = require('./gas');

const setup = (homebridge) => {
  homebridge.registerAccessory(
    'homebridge-esp8266-dht-sensor',
    'ESP8266DHT',
    ESP8266DHT
  );
};

const setGoogleAppsScript = (params) => {
  console.log(params);
  console.log(_auth);
  if (!_auth) authorize(params.config);

  const callGoogleAppsScript = () => {
    callAppsScript(
      params.config.scriptId,
      params.config.functionName,
      params.sensorData,
      (bool, res) => {
        console.log(bool);
        console.log(res);
      }
    );
  };
  setTimeout(() => {
    callGoogleAppsScript();
  }, 5000);
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
      temperature: 26,
      humidity: 50,
    };

    this.temperatureService = new this.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));

    this.humidityService = new this.Service.HumiditySensor(this.name);

    this.humidityService
      .getCharacteristic(this.Characteristic.CurrentRelativeHumidity)
      .onGet(this.handleCurrentRelativeHumidityGet.bind(this));
    if (config.gas) {
      setGoogleAppsScript({
        sensorData: this.sensorData,
        config: config.gas,
      });
    }
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

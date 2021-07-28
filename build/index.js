'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _gas = require("./gas");

var _axios = _interopRequireDefault(require("axios"));

var setup = function setup(homebridge) {
  homebridge.registerAccessory('homebridge-esp8266-dht-sensor', 'ESP8266DHT', ESP8266DHT);
};

var setGoogleAppsScript = function setGoogleAppsScript(params) {
  if (!_gas._auth) (0, _gas.authorize)(params.config);

  var callGoogleAppsScript = function callGoogleAppsScript() {
    (0, _gas.callAppsScript)(params.config.scriptId, params.config.functionName, params.sensorData, function (bool, res) {
      if (bool) {
        setTimeout(function () {
          callGoogleAppsScript();
        }, 30000);
      } else {
        console.log("Call Google Apps Script Error");
        console.log(res);
      }
    });
  };

  callGoogleAppsScript();
};

var ESP8266DHT = /*#__PURE__*/function () {
  function ESP8266DHT(log, config, api) {
    (0, _classCallCheck2["default"])(this, ESP8266DHT);
    log('ESP8266DHT Start!');
    this.log = log;
    this.config = config;
    this.api = api;
    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;
    this.name = config.name;
    this.ip = config.ip;
    this.log("Name : ".concat(this.name, ", IP : ").concat(this.ip));
    this.sensorData = {
      temperature: 26,
      humidity: 50
    };
    this.temperatureService = new this.Service.TemperatureSensor(this.name);
    this.temperatureService.getCharacteristic(this.Characteristic.CurrentTemperature).onGet(this.handleCurrentTemperatureGet.bind(this));
    this.humidityService = new this.Service.HumiditySensor(this.name);
    this.humidityService.getCharacteristic(this.Characteristic.CurrentRelativeHumidity).onGet(this.handleCurrentRelativeHumidityGet.bind(this));

    if (config.gas) {
      setGoogleAppsScript({
        sensorData: this.sensorData,
        config: config.gas
      });
    }
  }

  (0, _createClass2["default"])(ESP8266DHT, [{
    key: "handleCurrentTemperatureGet",
    value: function handleCurrentTemperatureGet() {
      this.log('Triggered GET CurrentTemperature');
      this.getSensorData();
      return this.sensorData.temperature;
    }
  }, {
    key: "handleCurrentRelativeHumidityGet",
    value: function handleCurrentRelativeHumidityGet() {
      this.log('Triggered GET CurrentHumidity');
      return this.sensorData.humidity;
    }
  }, {
    key: "getSensorData",
    value: function () {
      var _getSensorData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var refineData, _yield$axios$get, data;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.log('Axios', this.ip);

                refineData = function refineData(data) {
                  return JSON.parse(data.replace(/&quot;/g, '"'));
                };

                _context.prev = 2;
                _context.next = 5;
                return _axios["default"].get("http://".concat(this.ip));

              case 5:
                _yield$axios$get = _context.sent;
                data = _yield$axios$get.data;
                this.sensorData = refineData(data);
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](2);
                this.log(_context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 10]]);
      }));

      function getSensorData() {
        return _getSensorData.apply(this, arguments);
      }

      return getSensorData;
    }()
  }, {
    key: "getServices",
    value: function getServices() {
      return [this.temperatureService, this.humidityService];
    }
  }]);
  return ESP8266DHT;
}();

module.exports = setup;
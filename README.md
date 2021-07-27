# homebridge-esp8266-dht-sensor

Get humidity and temparature from DHT22 Sensor with ESP8266 in HomeKit.

## Installation(incomplete)

1. [How to set ESP8266](./arduino-sketch/HowToSetESP8266.md)
2. Install this plugin using: `npm i homebridge-esp8266-dht22`
3. Update your configuration file.

## Configuration
```
"accessories": [
    {
        "accessory": "ESP8266DHT"
        "name": "ESP8266",
        "ip": "192.168.0.10",
    }
]
```

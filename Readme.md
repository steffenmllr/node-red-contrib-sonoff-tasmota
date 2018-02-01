# node-red-contrib-sonoff-tasmota

[![NPM version][npm-image]][npm-url]

> A [Node-RED](https://nodered.org) node, to control [Sonoff](https://www.itead.cc/) switches running the awesome [Sonoff-Tasmota](https://github.com/arendst/Sonoff-Tasmota) firmware

## Installation

Install `node-red-contrib-sonoff-tasmota` using [npm](https://www.npmjs.com/):

```bash
npm install --save node-red-contrib-sonoff-tasmota
```

## Usage

To use the node, just drag the node from the Sonoff section to the Flow, add the id and the mqtt broker. 
To control the switch you can use a true/false input node or connect a UI Button.

## Sample FLOW

![Sample Flow](/media/flow.png?raw=true)

```json
[{
    "mode": "0",
    "id": "31a99116.86e71",
    "device": "light_livingroom",
    "type": "Sonoff device",
    "z": "c99f41b0.86e72",
    "broker": "31a99116.50a74e",
    "name": "Living Room Light",
    "onValue": "ON",
    "offValue": "OFF",
    "cmdPrefix": "cmnd",
    "statPrefix": "stat",
    "telePrefix": "tele",
    "x": 323.5,
    "y": 292,
    "wires": [
        ["83ebc5bb.bf90c8", "cf638ecc.54904"]
    ]
}, {
    "id": "31a99116.50a74e",
    "type": "mqtt-broker",
    "z": "",
    "broker": "localhost",
    "port": "1883",
    "clientid": "",
    "usetls": false,
    "compatmode": true,
    "keepalive": "60",
    "cleansession": true,
    "willTopic": "",
    "willQos": "0",
    "willPayload": "",
    "birthTopic": "",
    "birthQos": "0",
    "birthPayload": ""
}]
```

## License

MIT © [Steffen Müller](http://steffen.io)

[npm-url]: https://npmjs.org/package/node-red-contrib-sonoff-tasmota
[npm-image]: https://badge.fury.io/js/node-red-contrib-sonoff-tasmota.svg

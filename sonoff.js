'use strict';

module.exports = function (RED) {
    const debug = require('debug')('sonoff');

    function SonoffDevice(config) {
        // Create Node
        RED.nodes.createNode(this, config);

        // Setup mqtt broker
        const brokerConnection = RED.nodes.getNode(config.broker);

        // Topics
        const topicTeleLWT = `${config.id}/${config.telePrefix}/LWT`;

        const topicCmdPower = `${config.id}/${config.cmdPrefix}/power`;
        const topicCmdStatus = `${config.id}/${config.cmdPrefix}/status`;

        const topicStatsPower = `${config.id}/${config.statPrefix}/POWER`;
        const topicStatsStatus = `${config.id}/${config.statPrefix}/STATUS`;

        if (brokerConnection) {
            brokerConnection.register(this);
            this.status({fill: 'yellow', shape: 'dot', text: 'Connecting...'});

            // Check if the node is online
            brokerConnection.subscribe(topicTeleLWT, 2, (topic, payload) => {
                const stringPayload = payload.toString();
                debug('Topic: %s, Value: %s', topic, stringPayload);
                if (stringPayload === 'Online') {
                    this.status({fill: 'green', shape: 'ring', text: 'Online'});
                } else {
                    this.status({fill: 'red', shape: 'dot', text: 'Offline'});
                }
            });

            brokerConnection.subscribe(topicStatsStatus, 2, (topic, payload) => {
                const stringPayload = payload.toString();
                debug('Topic: %s, Value: %s', topic, stringPayload);
                try {
                    const jsonPayload = JSON.parse(stringPayload);
                    if (jsonPayload.Status.Power === 1) {
                        this.status({fill: 'green', shape: 'dot', text: 'On'});
                        this.send({payload: true});
                    } else {
                        this.status({fill: 'grey', shape: 'dot', text: 'Off'});
                        this.send({payload: false});
                    }
                } catch (err) {
                    this.status({fill: 'red', shape: 'dot', text: 'Error processing Status from device'});
                    this.error(err, 'Error processing Status from device');
                }
            });

            // Subscribes if the state of the device changes
            brokerConnection.subscribe(topicStatsPower, 2, (topic, payload) => {
                const stringPayload = payload.toString();
                debug('Topic: %s, Value: %s', topic, stringPayload);

                if (stringPayload === config.onValue) {
                    this.status({fill: 'green', shape: 'dot', text: 'On'});
                    this.send({payload: true});
                }
                if (stringPayload === config.offValue) {
                    this.status({fill: 'grey', shape: 'dot', text: 'Off'});
                    this.send({payload: false});
                }
            });

            // On input we publish a true/false
            this.on('input', msg => {
                debug('INPUT: %s', JSON.stringify(msg));
                const payload = msg.payload;

                // We handle boolean, the onValue and msg.On to support homekit
                if (payload === true || payload === config.onValue) {
                    brokerConnection.client.publish(topicCmdPower, config.onValue, {qos: 0, retain: false});
                    this.send({payload: true});
                }

                if (payload === false || payload === config.offValue) {
                    brokerConnection.client.publish(topicCmdPower, config.offValue, {qos: 0, retain: false});
                    this.send({payload: false});
                }
            });

            // Publish a start command to get the Status
            brokerConnection.client.publish(topicCmdStatus);
            this.status({fill: 'yellow', shape: 'ring', text: 'Requesting Status...'});

            // Remove Connections
            this.on('close', done => {
                brokerConnection.unsubscribe(topicTeleLWT, this.id);
                brokerConnection.unsubscribe(topicStatsPower, this.id);
                brokerConnection.unsubscribe(topicStatsStatus, this.id);
                brokerConnection.deregister(this, done);
            });
        } else {
            this.status({fill: 'red', shape: 'dot', text: 'Could not connect to mqtt'});
        }
    }

    RED.nodes.registerType('Sonoff device', SonoffDevice);
};

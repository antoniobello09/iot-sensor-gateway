const sensorLib = require('node-dht-sensor');
const mqtt = require('mqtt');

var sensorType = 11;
var sensorPin = 4;

const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
const topic = 'antoniobello/iot/sensor/data';

client.on('connect', () => {
    console.log('Connesso al broker MQTT');
});

setInterval(function () {
    const readout = sensorLib.read(sensorType, sensorPin);

    if (readout.humidity === 0 && readout.temperature === 0) {
        console.warn('Errore lettura sensore, riprovo...');
        return;
    }

    const data = JSON.stringify({
        sensor: 'ID1',
        timestamp: Date.now(),
        temperature: readout.temperature.toFixed(1),
        humidity: readout.humidity.toFixed(1)
    });

    client.publish(topic, data, { qos: 1 });
    console.log('Pubblicato:', data);

}, 2000);
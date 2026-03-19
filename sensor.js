const sensorLib = require('node-dht-sensor');
const http = require('node:http');

var sensorType = 11; // DHT11
var sensorPin = 4;   // GPIO4

// Leggi e invia ogni 2 secondi
setInterval(function () {
    const readout = sensorLib.read(sensorType, sensorPin);

    if (readout.humidity === 0 && readout.temperature === 0) {
        console.warn('Errore lettura sensore, riprovo...');
        return;
    }

    console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
    console.log('Humidity:', readout.humidity.toFixed(1) + '%');

    const postData = JSON.stringify({
        sensor: 'ID1',
        timestamp: Date.now(),
        temperature: readout.temperature.toFixed(1),
        humidity: readout.humidity.toFixed(1)
    });

    const options = {
        hostname: '192.168.1.250',
        port: 3000,
        path: '/temperature',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('BODY:', chunk);
        });
    });

    req.on('error', (e) => {
        console.log('Server non raggiungibile:', e.message);
    });

    req.write(postData);
    req.end();

}, 2000);
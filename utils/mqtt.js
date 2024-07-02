const mqtt = require('mqtt');

// MQTT broker URL
const brokerUrl = 'mqtt://broker.hivemq.com';

// Create a client instance
const client = mqtt.connect(brokerUrl);

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end(); // Close the connection on error
});

// When connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe to a topic
    client.subscribe('testing', (err) => {
        if (!err) {
            console.log('Subscribed to topic: testing');
        }
    });

    // Publish a message to a topic
    client.publish('testing', 'Hello MQTT');
});

// Handle incoming messages
client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
});

module.exports = client;
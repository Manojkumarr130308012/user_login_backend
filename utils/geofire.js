const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const { GeoFire } = require('geofire');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const firebaseConfig = {
    databaseURL: "https://spry-district-385610-default-rtdb.firebaseio.com",
    // Use your own config details
    serviceAccount: './serviceAccountKey.json'
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const driversRef = ref(database, 'drivers');
const requestRef = ref(database, 'requests');

// Create a GeoFire index
const geoFire = new GeoFire(driversRef);

const redis = new Redis({
    host: '127.0.0.1',  // Redis server host
    port: 6379,          // Redis server port
});


redis.ping((err, result) => {
    if (err) {
        console.error('Redis connection error:', err);
    } else {
        console.log('Redis connected:', result);
    }
});


redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});


function queryGeoLocation(req, res) {
    try {
        const lat = parseFloat(req.params.lat);
        const long = parseFloat(req.params.lng);
        const vehicle_type = req.params.vehicle_type;
        const service_type = req.params.service_type;
        const radius = parseInt(req.params.radius);
        var fire_drivers = [];
        
        let geoQuery = geoFire.query({ center: [lat, long], radius: radius });

        getGeoData = function(geoQuery) {
            return new Promise(function(resolve, reject) {
                geoQuery.on("key_entered", function(key, location, distance) {
                    const driverRef = ref(database, `drivers/${key}`);
                    driverRef.on('value', function(snap) {
                        let driver = snap.val();
                        let date = new Date();
                        let timestamp = date.getTime();
                        let conditional_timestamp = timestamp - (5 * 60 * 1000);
                        
                        if (conditional_timestamp < driver.updated_at) {
                            var servi = driver.service_category;
                            var splited_service = servi.split(',');
                            
                            if (driver.is_active == 1 && driver.is_available == 1 && driver.type == vehicle_type) {
                                splited_service.forEach(singleservice => {
                                    if (singleservice == service_type) {
                                        driver.distance = distance;
                                        fire_drivers.push(driver);
                                    }
                                });
                            }
                        }

                        resolve(fire_drivers);
                    });
                });
            });
        };

        getGeoData(geoQuery).then(function(data) {
            res.send({ success: true, message: 'success', data: data });
        }).catch((err) => {
            res.status(500).send("Error: " + err);
        });

    } catch (err) {
        res.status(500).send("Error: " + err);
    }
}

function queryGetDriversNotUpdated(req, res) {
    try {
        const lat = parseFloat(req.params.lat);
        const long = parseFloat(req.params.lng);
        const radius = parseInt(req.params.radius);
        var fire_drivers = [];
        let geoQuery = geoFire.query({ center: [lat, long], radius: radius });
        getGeoData = function(geoQuery) {
            return new Promise(function(resolve, reject) {
                geoQuery.on("key_entered", function(key, location, distance) {
                    const driverRef = ref(database, `drivers/${key}`);
                    driverRef.on('value', function(snap) {
                        let driver = snap.val();
                        let date = new Date();
                        let timestamp = date.getTime();
                        let conditional_timestamp = timestamp - (2 * 60 * 1000);
                        if (conditional_timestamp > driver.updated_at) {
                            if (driver.is_active == 1 && driver.is_available == 1) {
                                driver.distance = distance;
                                fire_drivers.push(driver);
                            }
                        }
                        resolve(fire_drivers);
                    });
                });
            });
        };

        getGeoData(geoQuery).then(function(data) {
            res.send({ success: true, message: 'success', data: data });
        }).catch((err) => {
            res.status(500).send("Error: " + err);
        });

    } catch (err) {
        res.status(500).send("Error: " + err);
    }
}

function queryGetDriversLogout(req, res) {
    try {
        const lat = parseFloat(req.params.lat);
        const long = parseFloat(req.params.lng);
        const radius = parseInt(req.params.radius);
        var fire_drivers = [];
        let geoQuery = geoFire.query({ center: [lat, long], radius: radius });
        getGeoData = function(geoQuery) {
            return new Promise(function(resolve, reject) {
                geoQuery.on("key_entered", function(key, location, distance) {
                    const driverRef = ref(database, `drivers/${key}`);
                    driverRef.on('value', function(snap) {
                        let driver = snap.val();
                        let date = new Date();
                        let timestamp = date.getTime();
                        let conditional_timestamp = timestamp - (30 * 60 * 1000);
                        if (conditional_timestamp > driver.updated_at) {
                            if (driver.is_active == 1 && driver.is_available == 1) {
                                driver.distance = distance;
                                fire_drivers.push(driver);
                            }
                        }
                        resolve(fire_drivers);
                    });
                });
            });
        };

        getGeoData(geoQuery).then(function(data) {
            res.send({ success: true, message: 'success', data: data });
        }).catch((err) => {
            res.status(500).send("Error: " + err);
        });

    } catch (err) {
        res.status(500).send("Error: " + err);
    }
}

function queryGetDrivers(req, res) {
    try {
        var fire_drivers = [];
        let geoQuery = geoFire.query({});

        getGeoData = function(geoQuery) {
            return new Promise(function(resolve, reject) {
                geoQuery.on("key_entered", function(key, location, distance) {
                    const driverRef = ref(database, `drivers/${key}`);
                    driverRef.on('value', function(snap) {
                        let driver = snap.val();
                        
                        let date = new Date();
                        let timestamp = date.getTime();
                        let conditional_timestamp = timestamp - (30 * 60 * 1000);
            
                        if (conditional_timestamp < driver.updated_at) {
                            if (driver.is_active == 1 && driver.is_available == 1) {
                                driver.distance = distance;
                                fire_drivers.push(driver);
                            }
                        }

                        resolve(fire_drivers);
                    });
                });
            });
        };

        getGeoData(geoQuery).then(function(data) {
            res.send({ success: true, message: 'success', data: data });
        }).catch((err) => {
            res.status(500).send("Error: " + err);
        });

    } catch (err) {
        res.status(500).send("Error: " + err);
    }
}

module.exports = {queryGeoLocation, queryGetDriversNotUpdated, queryGetDriversLogout, queryGetDrivers};

const express = require("express");
const server = express();
const bodyParser=require('body-parser');
const config=require("./../config/config.json");
const mongoose = require('mongoose');
const {verifyTokenAndAuthorization} =  require('../middleware/verifyToken');
const uploadStorage = require("../utils/file_upload")
const sendEmail = require("../utils/smtp_function");
const generateOtp = require("../utils/otp_generator")
const { sendAndroidNotification, sendiOSNotification } = require('../utils/push_notifications');
const { fetchDistanceMatrix } = require('../utils/distance-matrix');
const { generateRequestNumber } = require('../utils/request_number');
const s3UploadStorage = require("../utils/s3_file_upload");
const mqtt  = require("../utils/mqtt");
// const {queryGeoLocation,queryGetDriversNotUpdated,queryGetDriversLogout,queryGetDrivers} = require('./../utils/geofire')
// const Redis = require("ioredis");
// const socketIo = require('socket.io');
// const http = require('http');
// const redis = new Redis();
require('dotenv').config();
server.use(bodyParser.json());

//cors
const cors = require('cors');




server.use(
    cors({
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
  server.options(
    '*',
    cors({
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );


// db connection

let { protocal, host, port, name,username,password } = config.app.db;

let db = `${protocal}://${username}:${password}@${host}/${name}`;

mongoose.connect(db)
.then(() => {
  console.log('Successfully connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});


//router intialization
const authRouter = require('./../router/auth');
const userRouter = require('./../router/user');
const client = require("../utils/mqtt");

server.use("/api/auth", authRouter);
server.use("/user",verifyTokenAndAuthorization, userRouter);


  // Single File
  server.post("/upload/single", uploadStorage.single("file"), (req, res) => {
    console.log(req.file.path)
    return res.json({ path: ''+req.file.path });
  });

  //Multiple Files
  server.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
    console.log(req.files)
    return res.send("Multiple files")
  });

  //Mail Transfer
  server.post('/send/mail', async (req, res) => {
    sendEmail(req.body.mail,req.body.message);
    res.json({ message: 'Mail Sent SucessFully' });
   });
  
  //Generate Otp
  server.post('/generateOtp', async (req, res) => {
    res.json({ otp: generateOtp() });
  });


  //send pushNotification
  server.post('/sendNotification', async (req, res) => {
    const { deviceToken, title, body, platform } = req.body;

    try {
        if (platform === 'android') {
            await sendAndroidNotification(deviceToken, title, body);
        } else if (platform === 'ios') {
            await  sendiOSNotification(deviceToken, title, body);
        } else {
            throw new Error('Unsupported platform');
        }
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Error sending notification');
    }
});

//get distance
server.get('/api/distance-matrix', async (req, res) => {
  const { pickup_lat, pickup_long, drop_lat, drop_long } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key

  // Validate input (optional)
  if (!pickup_lat || !pickup_long || !drop_lat || !drop_long) {
      return res.status(400).json({ error: 'pickup_lat, pickup_long, drop_lat, and drop_long are required' });
  }

  try {
      // Fetch distance matrix data
      const distanceMatrixData = await fetchDistanceMatrix(
          parseFloat(pickup_lat),
          parseFloat(pickup_long),
          parseFloat(drop_lat),
          parseFloat(drop_long),
          apiKey
      );

      res.json(distanceMatrixData);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch distance matrix data' });
  }
});


//s3 File upload
server.post('s3/upload', s3UploadStorage.single('file'), async (req, res) => {
  try {
    const params = {
      Bucket:  process.env.AWS_BUCKET,
      Key: req.file.originalname,
      Body: req.file.buffer,
    };
    const s3Data = await s3.upload(params).promise();

    res.send({
      status: "success",
      url: s3Data.Location
  });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});


 //Generate Request Number
 server.get('/generateRequestNumber', async (req, res) => {

  let Number = await generateRequestNumber();

  res.json({ RequestNumber: Number });
});

server.get('/mqtt/test', async (req, res) => {

  client.publish('testing', 'Hello MQTT');

  res.json({ message:"Data Inserted" });
});
// const socketserver = http.createServer(server);
// const io = socketIo(socketserver);


// redis.subscribe("general");

// // message is default in redis
// redis.on("message", function (channel, data) {
//     let response = JSON.parse(data);
//     console.log(response)
//     io.emit(response.event, response.message)
// })


// io.on('connection',function (socket){
//     console.log('connected');
//     socket.on('disconnect',(err) => {
//         console.log('disconnected',err)
//     })

//     // for testing does it works
//     socket.on('test',function(data){
//         console.log(data)
//     })
// });



// // default route

// server.get('/:lat/:lng/:vehicle_type/:service_type/:radius', function(req, res) {
//   return queryGeoLocation(req, res);
// });

// server.get('/driver/:slug', function(req, res) {
//   return queryDriverLocation(req, res);
// });

// server.get('/get-drivers', function(req, res) {
//   return queryGetDrivers(req, res);
// });

// server.get('/drivers-logout/:lat/:lng/:radius', function(req, res) {
//   return queryGetDriversLogout(req, res);
// });

// server.get('/get-drivers-not-updated/:lat/:lng/:radius', function(req, res) {
//   return queryGetDriversNotUpdated(req, res);
// });



module.exports= server;
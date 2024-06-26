const express = require("express");
const server = express();
const bodyParser=require('body-parser');
const config=require("./../config/config.json");
const mongoose = require('mongoose');
const {verifyTokenAndAuthorization} =  require('../middleware/verifyToken');
const uploadStorage = require("../utils/file_upload")
const sendEmail = require("../utils/smtp_function")
require('dotenv').config();
server.use(bodyParser.json());

//cors
const cors = require('cors');
server.use(cors({ origin: 'http://192.168.1.131:3000' }));
server.use(cors({ origin: 'https://www.taxiappz.com/' }));

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

server.use("/api/auth", authRouter);
server.use("/user",verifyTokenAndAuthorization, userRouter);


  // Single file
  server.post("/upload/single", uploadStorage.single("file"), (req, res) => {
    console.log(req.file.path)
    return res.json({ path: ''+req.file.path });
  });

  //Multiple files
  server.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
    console.log(req.files)
    return res.send("Multiple files")
  });

  //Mail Transfer
  server.post('/sendmail', async (req, res) => {
    sendEmail(req.body.mail,req.body.message);
    res.json({ message: 'Mail Sent SucessFully' });
   });
  

module.exports= server;
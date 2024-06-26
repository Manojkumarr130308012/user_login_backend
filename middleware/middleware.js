const express = require("express");
const server = express();
const bodyParser=require('body-parser');
const config=require("./../config/config.json");
const mongoose = require('mongoose');
const {verifyTokenAndAuthorization} =  require('../middleware/verifyToken');


require('dotenv').config();

server.use(bodyParser.json());
const cors = require('cors');
server.use(cors({ origin: 'http://192.168.1.131:3000' }))

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


const authRouter = require('./../router/auth');
const userRouter = require('./../router/user');

let { protocal, host, port, name,username,password } = config.app.db;

let db = `${protocal}://${username}:${password}@${host}/${name}`;

mongoose.connect(db)
.then(() => {
  console.log('Successfully connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

  
server.use("/api/auth", authRouter);
server.use("/user",verifyTokenAndAuthorization, userRouter);

module.exports= server;
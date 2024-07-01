const express = require("express");
const multer = require("multer");
const aws = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })
  
  const s3UploadStorage = multer({ storage: storage });

  module.exports = s3UploadStorage;
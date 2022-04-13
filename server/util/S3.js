require('dotenv').config;
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
aws.config.region = 'ap-northeast-1';
aws.config.update({ region: 'ap-northeast-1' });
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const s3upload = async (user_id, where, type, filename) => {
  let sort;
  if (type == 'image/jpeg' || type == 'image/png') {
    sort = 'img';
  } else {
    //audio/mpeg  (mp3)
    sort = 'audio';
  }
  const Key = `${user_id}/${where}/${sort}/${Date.now()}+${filename}`;
  const s3Params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key,
    Expires: 200,
    ContentType: type,
    ACL: 'public-read',
  };
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  const result = {
    presignedURL: uploadURL,
    Key,
  };
  return result;
};

module.exports = { s3upload };

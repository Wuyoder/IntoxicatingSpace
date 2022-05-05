require('dotenv').config;
const aws = require('aws-sdk');
const s3 = new aws.S3({
  region: 'ap-northeast-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});
const { jwtwrap } = require('./jwt');
const { v4 } = require('uuid');

const s3upload = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.json(who);
  }
  let Key;
  let type;
  const info = req.body;
  if (!info.type) {
    return res.status(400).json({ error: 'type missing' });
  }
  if (info.type === 'profile_image') {
    Key = `profile/${who.id}/${v4()}.jpg`;
    type = 'image/jpeg';
  }
  if (info.type === 'show_image') {
    Key = `podcast/${who.id}/show_image/${v4().replace('-', '')}.jpg`;
    type = 'image/jpeg';
  }
  if (info.type === 'episode_image') {
    Key = `podcast/${who.id}/${info.episode_num}/episode_image/${v4()}.jpg`;
    type = 'image/jpeg';
  }
  if (info.type === 'episode_file') {
    Key = `podcast/${who.id}/${info.episode_num}/episode_file/${v4()}.mp3`;
    type = 'audio/mpeg';
  }
  const s3Params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key: Key,
    Expires: 200,
    ContentType: type,
    //ACL: 'public-read',
  };
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  const result = {
    presignedURL: uploadURL,
    Key,
  };

  return res.send(result);
};

module.exports = { s3upload };

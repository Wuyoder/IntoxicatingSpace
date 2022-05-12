//const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const util = require('util');
console.log('befor sharp require');
const sharp = require('sharp');
//const jimp = require('jimp');
const s3 = new aws.S3({
  region: 'ap-northeast-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

exports.handler = async (event, context, callback) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const dstBucket = srcBucket;
  const srcKey = event.Records[0].s3.object.key.replace(/\+/g, ' ');

  const dstKey = 'resize/' + srcKey;
  console.log('get bucket', srcBucket);
  console.log('get srckey', srcKey);
  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log('Could not determine the image type.');
    return 'Could not determine the image type.';
  }

  const imageType = typeMatch[1].toLowerCase();
  if (imageType != 'jpg' && imageType != 'png') {
    console.log(`Unsupported image type: ${imageType}`);
    return `Unsupported image type: ${imageType}`;
  }

  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };
    var origimage = await s3.getObject(params).promise();
  } catch (err) {
    console.log(err);
    return err;
  }

  console.log('before sharp resize');
  try {
    console.log('try resize');
    console.log('origimage', origimage);
    var buffer = await sharp(origimage.Body).resize(1400, 1400).toBuffer();
  } catch (err) {
    console.log('resize error');
    console.log(err);
    return err;
  }
  console.log('get image buffer');
  try {
    const desparams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: buffer,
      ContentType: 'image',
    };
    const putResult = await s3.putObject(desparams).promise();
  } catch (err) {
    console.log(err);
    return err;
  }

  console.log(
    'Successfully resized ' +
      srcBucket +
      '/' +
      srcKey +
      ' and uploaded to ' +
      dstBucket +
      '/' +
      dstKey
  );
};

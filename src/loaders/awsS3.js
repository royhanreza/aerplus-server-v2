const aws = require('aws-sdk');
const config = require('../config');

const { region, secretAccessKey, accessKeyId } = config.aws.s3;

aws.config.update({
  region,
  secretAccessKey,
  accessKeyId,
});

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = s3;

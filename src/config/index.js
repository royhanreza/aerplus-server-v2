const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  /**
   * Server
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * Database
   */
  dbConnection: process.env.DB_CONNECTION,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbDatabase: process.env.DB_DATABASE,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUrl: process.env.DB_URL,
  /**
   * JWT
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  /**
   * Winston Logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * Firebase
   */
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },

  aws: {
    s3: {
      region: process.env.AWS_S3_REGION,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      bucket: process.env.AWS_S3_AERPLUS_BUCKET,
    },
  },
};

/* eslint-disable import/no-unresolved */
const { cert, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const config = require('../config');

const { projectId, clientEmail, privateKey } = config.firebase;

initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  //   databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});

const firestore = getFirestore();

module.exports = {
  firestore,
};

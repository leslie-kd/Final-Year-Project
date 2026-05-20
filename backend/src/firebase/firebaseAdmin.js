const admin = require('firebase-admin');

const fs = require('fs');
const path = require('path');

let db = null;

try {
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    db = admin.database();
    console.log('Firebase Admin Initialized successfully using serviceAccountKey.json.');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    db = admin.database();
    console.log('Firebase Admin Initialized successfully using environment variables.');
  } else {
    console.warn('WARNING: Firebase service account missing! Please add serviceAccountKey.json to the backend folder.');
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
}

module.exports = { admin, db };

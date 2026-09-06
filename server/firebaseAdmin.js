// server/firebaseAdmin.js
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

if (admin.getApps().length === 0) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  const hasPlaceholderCredentials = [projectId, clientEmail, privateKey].some((value) =>
    /your_|YOUR_|example|private_key/i.test(value || '')
  );

  if (projectId && clientEmail && privateKey && !hasPlaceholderCredentials) {
    try {
      admin.initializeApp({
        credential: admin.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase Admin initialized from environment variables');
    } catch (error) {
      console.warn(
        `Firebase Admin not initialized: invalid private key. Replace FIREBASE_PRIVATE_KEY with the key from a Firebase service-account JSON file. (${error.message})`
      );
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      admin.initializeApp({
        credential: admin.applicationDefault(),
      });
      console.log('Firebase Admin initialized using application default credentials');
    } catch (error) {
      console.warn(`Firebase Admin not initialized: ${error.message}`);
    }
  } else {
    console.warn(
      'Firebase Admin not initialized: set valid FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env.'
    );
  }
}

admin.auth = () => getAuth();

module.exports = admin;

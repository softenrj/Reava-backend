import admin from 'firebase-admin';
import { serviceAccount } from './firebaseCredentials'; // your downloaded file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

export default admin;
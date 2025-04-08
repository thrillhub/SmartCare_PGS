import * as admin from "firebase-admin";
import serviceAccount from '../../src/app/firebaseServiceAccount.json'; // Adjust the path accordingly

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://smart-care-connects-default-rtdb.firebaseio.com/", // Use this URL
    });
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  throw new Error("Could not initialize Firebase Admin SDK. Please check your service account key.");
}

export { admin };
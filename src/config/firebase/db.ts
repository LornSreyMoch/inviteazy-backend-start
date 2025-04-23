
import admin from 'firebase-admin';
const serviceAccount = require("../../../serviceAccountKey.json");
admin.initializeApp({  credential: admin.credential.cert(serviceAccount),  projectId: "invitation-aee15",});
const db = admin.firestore();
export { db };


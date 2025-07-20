const admin = require("firebase-admin");
const serviceAccount = require("../menstyle-e9abd-firebase-adminsdk-fbsvc-381f28fb7c.json"); // file JSON từ Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

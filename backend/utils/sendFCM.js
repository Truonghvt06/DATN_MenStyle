const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const serviceAccount = require("../menstyle-e9abd-firebase-adminsdk-fbsvc-381f28fb7c.json"); // đường dẫn JSON

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token;
}

async function sendFCMToDevice(token, title, body, data = {}) {
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token,
      notification: {
        title,
        body,
      },
      data, // custom key-value nếu cần
    },
  };

  const projectId = serviceAccount.project_id;

  await axios.post(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    message,
    {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = { sendFCMToDevice };

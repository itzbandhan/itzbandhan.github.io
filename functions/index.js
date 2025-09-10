// Firebase Functions template for sending push on new message
// To use: `firebase init functions` (Node 18), replace this file, run `npm i firebase-admin firebase-functions`.
import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

export const sendChatPush = functions.database.ref("/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const msg = snapshot.val() || {};
    const receiver = msg.sender === "Sallu" ? "Bandhu" : "Sallu";

    // Fetch all tokens for receiver
    const tokensSnap = await admin.database().ref(`/tokens/${receiver}`).get();
    if (!tokensSnap.exists()) return null;

    const tokens = Object.keys(tokensSnap.val() || {});
    if (!tokens.length) return null;

    const payload = {
      notification: {
        title: `New message from ${msg.sender}`,
        body: msg.type === "text" ? msg.content : (msg.type === "love" ? "sent ❤️" : "sent a photo")
      }
    };

    await admin.messaging().sendToDevice(tokens, payload);
    return null;
  });

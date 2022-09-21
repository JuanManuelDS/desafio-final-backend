const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");
const firebaseServiceAccount = require("./desafio-final-ca9a1-firebase-adminsdk-xstms-2ec7686c63.json");

const CONNECTION_URL =
  "mongodb+srv://juanma-admin:1234num@cluster0.qrlvjzn.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabases() {
  await mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  });
}

module.exports = {
  connectToDatabases,
  firebaseAdmin,
};

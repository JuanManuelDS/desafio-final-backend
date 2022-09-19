const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");
const firebaseServiceAccount = require("./desafio-final-ca9a1-firebase-adminsdk-xstms-9c26536f64.json");

const firebaseDB = firebaseAdmin.firestore();
const Carts = firebaseDB.collection("carts");

const CONNECTION_URL =
  "mongodb+srv://juanma-admin:1234num@cluster0.qrlvjzn.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabases() {
  mongoose
    .connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
      })
    );
}

module.exports = { Carts, connectToDatabases };

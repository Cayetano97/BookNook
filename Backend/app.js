const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const bookController = require("./controller/bookController");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use("/", bookController(db));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/routes");

const app = express();
const PORT = 7777;

const db = require("./src/config/mongoose");

app.use(express.json());

app.use("/api", router);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error in starting server:", err);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});

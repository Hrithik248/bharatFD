const express = require("express");
const router = require("./src/routes");
const setupAdminJS = require("./src/config/admin");
const connectToDatabase = require("./src/config/mongoose"); 
const app = express();
const PORT = 7777;

app.use(express.json());

async function startServer() { 
  try {
    await connectToDatabase();
    console.log("Mongoose connected in index.js");

    await setupAdminJS(app);
    console.log('AdminJS setup complete');

    app.use("/api", router);

    app.listen(PORT, (err) => {
      if (err) {
        console.error("Error in starting server:", err);
      } else {
        console.log(`Server started on port ${PORT}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();

const mongoose = require("mongoose");

async function connectToDatabase() { 
  try {
    await mongoose.connect(`mongodb://localhost:27017/bharatFD`, { 
      useNewUrlParser: true,  
      useUnifiedTopology: true, 
      family: 4 
    });
    console.log("Database connected");
    return mongoose; 
  } catch (err) {
    console.error("Database connection error:", err);
    throw err; 
  }
}

module.exports = connectToDatabase; 
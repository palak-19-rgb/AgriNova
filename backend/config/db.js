
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log("MongoDB Atlas Connected Successfully!");
    console.log("Database:", mongoose.connection.name);

  } catch (error) {
    console.error("\nMongoDB Connection Failed!");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    if (error.cause) {
      console.error("Cause:", error.cause);
    }

    throw error;
  }
};

module.exports = connectDB;
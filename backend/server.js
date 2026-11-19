require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const greenhouseRoutes = require("./routes/greenhouseRoutes");
const dataRoutes = require("./routes/dataRoutes");
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const app = express();
const cropDoctorRoutes = require("./routes/cropDoctorRoutes");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/data", dataRoutes);
app.use("/auth", authRoutes);
app.use("/greenhouse", greenhouseRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/crop-doctor", cropDoctorRoutes);
// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`AgriNova Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
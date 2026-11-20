
const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataController");

// Get latest sensor data for dashboard
router.get("/", controller.getLatestData);

// Receive sensor data from ESP32
router.post("/", controller.receiveSensorData);

module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataController");

// Get latest sensor data for dashboard
router.get("/", controller.getLatestData);

// Existing ESP32 endpoint
router.post("/", controller.receiveSensorData);

// TTN webhook endpoint
router.post("/ttn", controller.receiveTTNData);
router.get("/history", controller.getSensorHistory);
module.exports = router;

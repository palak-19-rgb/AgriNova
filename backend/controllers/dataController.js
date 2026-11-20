
const SensorData = require("../models/SensorData");

// Get latest sensor data for dashboard
exports.getLatestData = async (req, res) => {
  try {
    const data = await SensorData.findOne().sort({ timestamp: -1 });

    if (!data) {
      return res.status(200).json({
        temperature: null,
        humidity: null,
        light: null,
        soilTemperature: null,
        soilMoisture: null,
        waterLevel: null,
        timestamp: null
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sensor data",
      error: error.message
    });
  }
};

// Receive sensor data from ESP32
exports.receiveSensorData = async (req, res) => {
  try {
    const {
      temperature,
      humidity,
      light,
      soilTemperature,
      soilMoisture,
      waterLevel
    } = req.body;

    const newData = await SensorData.create({
      temperature,
      humidity,
      light,
      soilTemperature,
      soilMoisture,
      waterLevel
    });

    res.status(201).json({
      message: "Sensor data saved successfully",
      data: newData
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save sensor data",
      error: error.message
    });
  }
};

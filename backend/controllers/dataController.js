
const SensorData = require("../models/SensorData");

// GET latest sensor data
exports.getLatestData = async (req, res) => {
  try {
    const data = await SensorData.findOne().sort({
      timestamp: -1
    });

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

// POST sensor data - partial update
exports.receiveSensorData = async (req, res) => {
  try {
    const allowedFields = [
      "temperature",
      "humidity",
      "light",
      "soilTemperature",
      "soilMoisture",
      "waterLevel"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No sensor data received"
      });
    }

    let data = await SensorData.findOne().sort({
      timestamp: -1
    });

    if (data) {
      Object.assign(data, updates);
      data.timestamp = new Date();
      await data.save();
    } else {
      data = await SensorData.create(updates);
    }

    res.status(201).json({
      message: "Sensor data saved successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save sensor data",
      error: error.message
    });
  }
};

// Receive sensor data from TTN webhook
exports.receiveTTNData = async (req, res) => {
  try {
    const decoded = req.body?.uplink_message?.decoded_payload;

    if (!decoded) {
      return res.status(400).json({
        message: "No decoded TTN payload received"
      });
    }

    const requiredFields = [
      "soil_moisture_adc",
      "air_temperature",
      "humidity",
      "soil_temperature"
    ];

    const missingFields = requiredFields.filter(
      field => typeof decoded[field] !== "number"
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing or invalid sensor values",
        missingFields
      });
    }

    const data = await SensorData.create({
      temperature: decoded.air_temperature,
      humidity: decoded.humidity,
      soilTemperature: decoded.soil_temperature,
      soilMoisture: decoded.soil_moisture_adc,
      timestamp: new Date()
    });

    return res.status(201).json({
      message: "TTN sensor data saved successfully",
      data
    });

  } catch (error) {
    console.error("TTN webhook error:", error);

    return res.status(500).json({
      message: "Failed to save TTN sensor data",
      error: error.message
    });
  }
};

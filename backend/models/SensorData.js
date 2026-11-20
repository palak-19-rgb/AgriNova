
const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  light: {
    type: Number,
    default: null
  },
  soilTemperature: {
    type: Number,
    default: null
  },
  soilMoisture: {
    type: Number,
    default: null
  },
  waterLevel: {
    type: Number,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SensorData", sensorDataSchema);

let latestData = {
  temperature: 25,
  humidity: 50,
  light: 742,
  soilTemperature: 24.8,
  soilMoisture: 58
};

// Dummy sensor data generator
setInterval(() => {
  latestData = {
    temperature: Math.floor(Math.random() * 10) + 25,
    humidity: Math.floor(Math.random() * 20) + 50,
    light: Math.floor(Math.random() * 200) + 650,
    soilTemperature: Number((23 + Math.random() * 4).toFixed(1)),
    soilMoisture: Math.floor(Math.random() * 20) + 50
  };
}, 2000);

module.exports = {
  getData: () => latestData
};
class DataModel {
  constructor(
    temp,
    hum,
    light,
    soilTemperature,
    soilMoisture
  ) {
    this.temperature = temp;
    this.humidity = hum;
    this.light = light;
    this.soilTemperature = soilTemperature;
    this.soilMoisture = soilMoisture;
    this.timestamp = new Date();
  }
}

module.exports = DataModel;

class DataModel {
  constructor(
    temp = null,
    hum = null,
    light = null,
    soilTemperature = null,
    soilMoisture = null,
    waterLevel = null
  ) {
    this.temperature = temp;
    this.humidity = hum;
    this.light = light;
    this.soilTemperature = soilTemperature;
    this.soilMoisture = soilMoisture;
    this.waterLevel = waterLevel;
    this.timestamp = new Date();
  }
}

module.exports = DataModel;

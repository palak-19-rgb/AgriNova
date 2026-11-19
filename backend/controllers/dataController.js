const ttn = require("../config/ttnConnect");
const DataModel = require("../models/dataModel");

exports.getLatestData = (req, res) => {
  const data = ttn.getData();

  const formattedData = new DataModel(
    data.temperature,
    data.humidity,
    data.light,
    data.soilTemperature,
    data.soilMoisture
  );

  res.json(formattedData);
};
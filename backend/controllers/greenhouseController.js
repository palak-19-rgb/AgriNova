
const User = require("../models/User");

// GET greenhouse settings
exports.getGreenhouse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      greenhouse: {
        ownerName: user.name,
ownerEmail: user.email,
ownerPhone: user.phone,
        greenhouseName: user.greenhouseName,
        location: user.location,
        greenhouseType: user.greenhouseType,
        greenhouseArea: user.greenhouseArea,
        areaUnit: user.areaUnit,
        numberOfZones: user.numberOfZones,

        crop: user.crop,
        cropVariety: user.cropVariety,
        growingStage: user.growingStage,
        plantingDate: user.plantingDate,
        expectedHarvestDate: user.expectedHarvestDate,
        growingDurationDays: user.growingDurationDays,
        plantCount: user.plantCount,

        growingMedium: user.growingMedium,
        irrigationMethod: user.irrigationMethod,

        targetTemperatureMin: user.targetTemperatureMin,
        targetTemperatureMax: user.targetTemperatureMax,
        targetHumidityMin: user.targetHumidityMin,
        targetHumidityMax: user.targetHumidityMax,
        targetMoistureMin: user.targetMoistureMin,
        targetMoistureMax: user.targetMoistureMax,

        alertPreferences: user.alertPreferences
      }
    });

  } catch (error) {
    console.error("Get greenhouse error:", error);

    res.status(500).json({
      message: "Could not fetch greenhouse settings"
    });
  }
};


// UPDATE greenhouse settings
exports.updateGreenhouse = async (req, res) => {
  try {
    const allowedFields = [
      "greenhouseName",
      "location",
      "greenhouseType",
      "greenhouseArea",
      "areaUnit",
      "numberOfZones",

      "crop",
      "cropVariety",
      "growingStage",
      "plantingDate",
      "expectedHarvestDate",
      "growingDurationDays",
      "plantCount",

      "growingMedium",
      "irrigationMethod",

      "targetTemperatureMin",
      "targetTemperatureMax",
      "targetHumidityMin",
      "targetHumidityMax",
      "targetMoistureMin",
      "targetMoistureMax",

      "alertPreferences"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (
      updates.greenhouseName !== undefined &&
      (typeof updates.greenhouseName !== "string" ||
        !updates.greenhouseName.trim())
    ) {
      return res.status(400).json({
        message: "Greenhouse name cannot be empty"
      });
    }

    if (updates.greenhouseName !== undefined) {
      updates.greenhouseName = updates.greenhouseName.trim();
    }

    if (updates.location !== undefined) {
      if (typeof updates.location !== "string") {
        return res.status(400).json({
          message: "Invalid greenhouse location"
        });
      }

      updates.location = updates.location.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Greenhouse settings updated successfully!",
      greenhouse: {
        greenhouseName: user.greenhouseName,
        location: user.location,
        greenhouseType: user.greenhouseType,
        greenhouseArea: user.greenhouseArea,
        areaUnit: user.areaUnit,
        numberOfZones: user.numberOfZones,
        crop: user.crop,
        cropVariety: user.cropVariety,
        growingStage: user.growingStage,
        plantingDate: user.plantingDate,
        expectedHarvestDate: user.expectedHarvestDate,
        growingDurationDays: user.growingDurationDays,
        plantCount: user.plantCount,
        growingMedium: user.growingMedium,
        irrigationMethod: user.irrigationMethod,
        targetTemperatureMin: user.targetTemperatureMin,
        targetTemperatureMax: user.targetTemperatureMax,
        targetHumidityMin: user.targetHumidityMin,
        targetHumidityMax: user.targetHumidityMax,
        targetMoistureMin: user.targetMoistureMin,
        targetMoistureMax: user.targetMoistureMax,
        alertPreferences: user.alertPreferences
      }
    });

  } catch (error) {
    console.error("Update greenhouse error:", error);

    res.status(400).json({
      message: error.message || "Could not update greenhouse settings"
    });
  }
};

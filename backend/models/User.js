
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Owner details
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    // Greenhouse profile
    greenhouseName: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      trim: true,
      default: ""
    },

    greenhouseType: {
      type: String,
      enum: ["Polyhouse", "Net House", "Glasshouse", "Open Field"],
      default: "Polyhouse"
    },

    greenhouseArea: {
      type: Number,
      min: 0,
      default: 0
    },

    areaUnit: {
      type: String,
      enum: ["sq. ft.", "sq. m.", "acres", "hectares"],
      default: "sq. ft."
    },

    numberOfZones: {
      type: Number,
      min: 1,
      default: 1
    },

    // Crop planning
    crop: {
      type: String,
      enum: [
        "Tomato",
        "Cucumber",
        "Capsicum",
        "Lettuce",
        "Spinach",
        "Strawberry",
        "Other"
      ],
      default: "Other"
    },

    cropVariety: {
      type: String,
      trim: true,
      default: ""
    },

    growingStage: {
      type: String,
      enum: [
        "Seedling",
        "Vegetative",
        "Flowering",
        "Fruiting",
        "Harvesting"
      ],
      default: "Seedling"
    },

    plantingDate: {
      type: Date,
      default: null
    },

    expectedHarvestDate: {
      type: Date,
      default: null
    },

    growingDurationDays: {
      type: Number,
      min: 0,
      default: 0
    },

    plantCount: {
      type: Number,
      min: 0,
      default: 0
    },

    // Growing setup
    growingMedium: {
      type: String,
      enum: ["Soil", "Cocopeat", "Hydroponics", "Other"],
      default: "Soil"
    },

    irrigationMethod: {
      type: String,
      enum: ["Drip", "Sprinkler", "Manual", "Other"],
      default: "Drip"
    },

    // Target environmental conditions
    targetTemperatureMin: {
      type: Number,
      default: 18
    },

    targetTemperatureMax: {
      type: Number,
      default: 30
    },

    targetHumidityMin: {
      type: Number,
      default: 45
    },

    targetHumidityMax: {
      type: Number,
      default: 80
    },

    targetMoistureMin: {
      type: Number,
      default: 40
    },

    targetMoistureMax: {
      type: Number,
      default: 70
    },

    // Alert preferences
    alertPreferences: {
      temperature: {
        type: Boolean,
        default: true
      },
      humidity: {
        type: Boolean,
        default: true
      },
      soilMoisture: {
        type: Boolean,
        default: true
      },
      light: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);


const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  analyzeCrop
} = require("../controllers/cropDoctorController");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    }
  }
});

router.post(
  "/analyze",
  upload.single("image"),
  analyzeCrop
);

module.exports = router;

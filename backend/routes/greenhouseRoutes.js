
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getGreenhouse,
  updateGreenhouse
} = require("../controllers/greenhouseController");

router.get("/", protect, getGreenhouse);
router.put("/", protect, updateGreenhouse);

module.exports = router;
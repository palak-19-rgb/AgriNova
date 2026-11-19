const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataController");

router.get("/", controller.getLatestData);

module.exports = router;
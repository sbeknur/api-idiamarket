const express = require("express");
const router = express.Router();
const { createColor, getAllColors, updateColor } = require("../controllers/colorController");


// Get all Colors
router.get("/colors", getAllColors);


module.exports = router;

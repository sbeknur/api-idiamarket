const express = require("express");
const router = express.Router();
const { createColor, getAllColors, updateColor } = require("../controllers/colorController");

// Create a new Color
router.post("/color", createColor);

// Get all Colors
router.get("/colors", getAllColors);

// Update a Color by ID
router.put("/color/:id", updateColor);

module.exports = router;

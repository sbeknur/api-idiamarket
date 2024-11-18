const express = require("express");
const router = express.Router();
const {
  getAllAttributes,
  getAttributeById,
} = require("../controllers/attributesController");


// Get all attributes
router.get("/attributes", getAllAttributes);

// Get a single attribute by ID
router.get("/attribute/:id", getAttributeById);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createAttributes, getAllAttributes, getAttributeById, updateAttributeById } = require("../controllers/attributesController");

// Create a new attribute
router.post("/attribute", createAttributes);

// Get all attributes
router.get("/attributes", getAllAttributes);

// Get a single attribute by ID
router.get("/attribute/:id", getAttributeById);

// Update a attribute by ID
router.put("/attribute/:id", updateAttributeById);

module.exports = router;

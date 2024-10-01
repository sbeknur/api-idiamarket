const express = require("express");
const router = express.Router();
const { createAttributeItem, getAllAttributeItems, updateAttributeItem, deleteAttributeItem } = require("../controllers/attributeItemController");

// Create a new attribute item
router.post("/attribute-item", createAttributeItem);

// Get all attribute items
router.get("/attribute-items", getAllAttributeItems);

// Update an existing attribute item by ID
router.put("/attribute-item/:id", updateAttributeItem);

// Delete an attribute item by ID
router.delete("/attribute-item/:id", deleteAttributeItem);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllAttributeItems,
} = require("../controllers/attributeItemController");

// Get all attribute items
router.get("/attribute-items", getAllAttributeItems);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createShortDescription, getAllShortDescriptions, updateShortDescription } = require("../controllers/shortDescriptionController");

// Create a new short description
router.post("/short-description", createShortDescription);

// Get all short descriptions
router.get("/short-descriptions", getAllShortDescriptions);

// Update a short description
router.put("/short-description/:id", updateShortDescription);

module.exports = router;

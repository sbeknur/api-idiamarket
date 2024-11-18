const express = require("express");
const router = express.Router();
const {
  getAllShortDescriptions,
} = require("../controllers/shortDescriptionController");

// Get all short descriptions
router.get("/short-descriptions", getAllShortDescriptions);

module.exports = router;

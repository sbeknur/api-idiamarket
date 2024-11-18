const express = require("express");
const router = express.Router();
const { getAllVariants } = require("../controllers/variantController");

// Get all variants
router.get("/variants", getAllVariants);

module.exports = router;

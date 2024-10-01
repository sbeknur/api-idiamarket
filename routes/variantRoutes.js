const express = require("express");
const router = express.Router();
const { createVariant, getAllVariants, updateVariantById, deleteVariantById } = require("../controllers/variantController");

// Create a new variant
router.post("/variant", createVariant);

// Get all variants
router.get("/variants", getAllVariants);

// Update a variant
router.put("/variant/:id", updateVariantById);

// Delete a variant
router.delete("/variant/:id", deleteVariantById);

module.exports = router;

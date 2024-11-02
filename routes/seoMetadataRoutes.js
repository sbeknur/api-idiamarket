const express = require("express");
const router = express.Router();
const {
  createSeoMetadata,
  getAllSeoMetadata,
  updateSeoMetadata,
  deleteSeoMetadata,
} = require("../controllers/seoMetadataController");

// Create or update SEO metadata
router.post("/seo-metadata", createSeoMetadata);

// Get all SEO metadata
router.get("/seo-metadatas", getAllSeoMetadata);

// Update or update SEO metadata
router.put("/seo-metadata/:id", updateSeoMetadata);

// Delete or update SEO metadata
router.delete("/seo-metadata/:id", deleteSeoMetadata);

module.exports = router;

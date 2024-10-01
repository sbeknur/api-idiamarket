const express = require("express");
const router = express.Router();
const { createOrUpdateSeoMetadata, getAllSeoMetadata } = require("../controllers/seoMetadataController");

// Create or update SEO metadata
router.post("/seo-metadata", createOrUpdateSeoMetadata);

// Get all SEO metadata
router.get("/seo-metadatas", getAllSeoMetadata);

module.exports = router;

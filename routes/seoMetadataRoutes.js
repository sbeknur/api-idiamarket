const express = require("express");
const router = express.Router();
const {
  getAllSeoMetadata,
} = require("../controllers/seoMetadataController");


// Get all SEO metadata
router.get("/seo-metadatas", getAllSeoMetadata);


module.exports = router;

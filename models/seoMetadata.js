const mongoose = require("mongoose");

const seoMetadataSchema = new mongoose.Schema({
  meta_title: {
    type: String,
    default: "",
  },
  meta_description: {
    type: String,
    default: "",
  },
  meta_header: {
    type: String,
    default: "",
  },
  seo_text: {
    type: JSON,
    default: "",
  },
});

module.exports = mongoose.model("SeoMetadata", seoMetadataSchema);

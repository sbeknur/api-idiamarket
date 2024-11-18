const SeoMetadata = require("../models/seoMetadata");


// Get all SEO metadata
exports.getAllSeoMetadata = async (req, res) => {
  try {
    const seoMetadata = await SeoMetadata.find({});
    res.send(seoMetadata);
  } catch (error) {
    res.status(500).send(error);
  }
};

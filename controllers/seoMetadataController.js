const SeoMetadata = require("../models/seoMetadata");

// Create or update SEO metadata
exports.createOrUpdateSeoMetadata = async (req, res) => {
  try {
    const { meta_title, meta_description, meta_header, seo_text } = req.body;

    let seoMetadata = await SeoMetadata.findOne({ meta_title });

    if (seoMetadata) {
      // Update existing SEO metadata
      seoMetadata.meta_description = meta_description;
      seoMetadata.meta_header = meta_header;
      seoMetadata.seo_text = seo_text;
    } else {
      // Create new SEO metadata
      seoMetadata = new SeoMetadata({
        meta_title,
        meta_description,
        meta_header,
        seo_text,
      });
    }

    await seoMetadata.save();
    res.send(seoMetadata);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all SEO metadata
exports.getAllSeoMetadata = async (req, res) => {
  try {
    const seoMetadata = await SeoMetadata.find({});
    res.send(seoMetadata);
  } catch (error) {
    res.status(500).send(error);
  }
};

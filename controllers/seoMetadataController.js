const SeoMetadata = require("../models/seoMetadata");

// Create SEO metadata
exports.createSeoMetadata = async (req, res) => {
  try {
    const { meta_title, meta_description, meta_header, seo_text } = req.body;

    const seoMetadata = new SeoMetadata({
      meta_title,
      meta_description,
      meta_header,
      seo_text,
    });

    await seoMetadata.save();

    res.status(201).send(seoMetadata);
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while creating SEO metadata.",
      error: error.message,
    });
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

// Update SEO metadata by ID
exports.updateSeoMetadata = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a URL parameter
    const { meta_title, meta_description, meta_header, seo_text } = req.body;

    // Find the SEO metadata by ID
    const seoMetadata = await SeoMetadata.findById(id);

    if (!seoMetadata) {
      return res.status(404).json({ message: "SEO metadata not found" });
    }

    // Update fields if they are provided in the request body
    if (meta_title !== undefined) seoMetadata.meta_title = meta_title;
    if (meta_description !== undefined) seoMetadata.meta_description = meta_description;
    if (meta_header !== undefined) seoMetadata.meta_header = meta_header;
    if (seo_text !== undefined) seoMetadata.seo_text = seo_text;

    // Save the updated document
    await seoMetadata.save();

    res.status(200).json(seoMetadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete SEO metadata by ID
exports.deleteSeoMetadata = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the SEO metadata by ID and delete it
    const seoMetadata = await SeoMetadata.findByIdAndDelete(id);

    if (!seoMetadata) {
      return res.status(404).json({ message: "SEO metadata not found" });
    }

    res.status(200).json({ message: "SEO metadata deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

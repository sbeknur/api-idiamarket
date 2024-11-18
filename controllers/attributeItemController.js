const slugify = require("slugify");
const AttributeItem = require("../models/attributeItem");

// Get all attribute items
exports.getAllAttributeItems = async (req, res) => {
  try {
    const attributeItems = await AttributeItem.find({}).populate("seo").populate("faq"); // Populating references
    res.status(200).send(attributeItems);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

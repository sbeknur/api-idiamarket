const slugify = require("slugify");
const Attributes = require("../models/attributes");

// Get all attributes
exports.getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attributes.find({}).populate("items");
    res.status(200).send(attributes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get a single attribute by ID
exports.getAttributeById = async (req, res) => {
  try {
    const attribute = await Attributes.findById(req.params.id).populate("items");
    if (!attribute) {
      return res.status(404).send({ message: "Attribute not found" });
    }
    res.status(200).send(attribute);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
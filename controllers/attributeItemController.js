const slugify = require("slugify");
const AttributeItem = require("../models/attributeItem");

// Create a new attribute item
exports.createAttributeItem = async (req, res) => {
  try {
    const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
    const slugifiedValue = slugify(req.body.value, { lower: true, strict: true });

    const attributeItem = new AttributeItem({
      ...req.body, // This will include new fields like `seo`, `faq`, `is_active`, etc.
      code: slugifiedTitle,
      attribute_values: slugifiedValue,
    });

    await attributeItem.save();

    res.status(201).send(attributeItem);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get all attribute items
exports.getAllAttributeItems = async (req, res) => {
  try {
    const attributeItems = await AttributeItem.find({}).populate("seo").populate("faq"); // Populating references
    res.status(200).send(attributeItems);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update an existing attribute item
exports.updateAttributeItem = async (req, res) => {
  try {
    const attributeItemId = req.params.id;
    const updateData = req.body;

    if (updateData.title) {
      updateData.code = slugify(updateData.title, { lower: true, strict: true });
    }

    if (updateData.value) {
      updateData.attribute_values = slugify(updateData.value, { lower: true, strict: true });
    }

    const attributeItem = await AttributeItem.findByIdAndUpdate(attributeItemId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!attributeItem) {
      return res.status(404).send({ error: "Attribute item not found" });
    }

    res.status(200).send(attributeItem);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete an attribute item by ID
exports.deleteAttributeItem = async (req, res) => {
  try {
    const attributeItemId = req.params.id;

    const attributeItem = await AttributeItem.findByIdAndDelete(attributeItemId);

    if (!attributeItem) {
      return res.status(404).send({ error: "Attribute item not found" });
    }

    res.status(200).send({ message: "Attribute item deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

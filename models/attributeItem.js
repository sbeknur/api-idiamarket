const mongoose = require("mongoose");

const attributeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  seo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeoMetadata",
  },
  faq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faq",
  },
  code: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  display_type: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  show_description: {
    type: Boolean,
    default: false,
  },
  attribute_values: {
    type: String,
    default: "",
  },
  priority: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
  },
});

module.exports = mongoose.model("AttributeItem", attributeItemSchema);

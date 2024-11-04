const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: "category",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  category_code: {
    type: String,
    required: true,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  image: {
    type: String,
  },
  anchors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anchor",
    },
  ],
  meta_data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeoMetadata",
  },
  faq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faq",
  },
});

module.exports = mongoose.model("Category", categorySchema);

const mongoose = require("mongoose");
const Variant = require("./variant");

const productSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  images: [String],
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  short_description: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortDescription",
    },
  ],
  attributes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attributes",
    },
  ],
  price: {
    type: String,
    required: true,
  },
  old_price: {
    type: String,
    default: "",
  },
  price_from: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: String,
    default: "",
  },
  cashback: {
    type: Number,
    default: 0,
  },
  cashback_amount: {
    type: String,
    default: "",
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  variants: {
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  },
  stickers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sticker",
    },
  ],
  meta_data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeoMetadata",
  },
  reviews: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  positive_reviews_rate: {
    type: Number,
    default: 0,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  url_videos: [String],
  about_url: {
    type: String,
    default: "",
  },
  is_enabled: {
    type: Boolean,
    default: true,
  },
  seo_redirects: [
    {
      type: String,
      default: "",
    },
  ],
});

productSchema.index({ title: "text", "short_description.text": "text" });

module.exports = mongoose.model("Product", productSchema);

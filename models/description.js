const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  html_content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Description", descriptionSchema);

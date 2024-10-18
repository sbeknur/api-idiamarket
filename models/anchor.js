const mongoose = require("mongoose");

const anchorSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  uri: {
    type: String,
  },
});

module.exports = mongoose.model("Anchor", anchorSchema);

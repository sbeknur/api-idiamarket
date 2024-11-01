const mongoose = require("mongoose");

const faq = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  list: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: JSON,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Faq", faq);

const Faq = require("../models/faq"); // Adjust path as needed

// Get all FAQ entries
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving FAQs", error: error.message });
  }
};

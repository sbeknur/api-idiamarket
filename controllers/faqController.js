const Faq = require("../models/faq"); // Adjust path as needed

// Create a new FAQ entry
exports.createFaq = async (req, res) => {
  try {
    const { title, list } = req.body;
    const newFaq = new Faq({ title, list });
    await newFaq.save();
    res.status(201).json({ message: "FAQ created successfully", faq: newFaq });
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};

// Get all FAQ entries
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving FAQs", error: error.message });
  }
};

// Update an FAQ entry by ID
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, list } = req.body;
    
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { $set: { title, list } },
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ updated successfully", faq: updatedFaq });
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

// Delete an FAQ entry by ID
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaq = await Faq.findByIdAndDelete(id);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};

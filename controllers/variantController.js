const Variant = require("../models/variant");

// Get all variants
exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find({}).populate("attribute").populate("color");
    res.send(variants);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

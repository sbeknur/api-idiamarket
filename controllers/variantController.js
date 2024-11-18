const Variant = require("../models/variant");

// Create a new variant
exports.createVariant = async (req, res) => {
    try {
        const variant = new Variant(req.body);
        await variant.save();
        res.status(201).send(variant);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all variants
exports.getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.find({}).populate("attribute").populate("color");
        res.send(variants);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update a variant by ID
exports.updateVariantById = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!variant) {
            return res.status(404).send({ error: "Variant not found" });
        }

        res.send(variant);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Delete a variant by ID
exports.deleteVariantById = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndDelete(req.params.id);

        if (!variant) {
            return res.status(404).send({ error: "Variant not found" });
        }

        res.send({ message: "Variant deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

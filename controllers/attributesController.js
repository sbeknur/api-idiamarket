const slugify = require("slugify");
const Attributes = require("../models/attributes");

// Create a new attribute
exports.createAttributes = async (req, res) => {
    try {
        const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });

        const attributes = new Attributes({
            ...req.body,
            code: slugifiedTitle,
        });

        await attributes.save();

        res.status(201).send(attributes);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all attributes
exports.getAllAttributes = async (req, res) => {
    try {
        const attributes = await Attributes.find({}).populate("items");
        res.status(200).send(attributes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get a single attribute by ID
exports.getAttributeById = async (req, res) => {
    try {
        const attribute = await Attributes.findById(req.params.id).populate("items");
        if (!attribute) {
            return res.status(404).send({ message: "Attribute not found" });
        }
        res.status(200).send(attribute);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update an attribute by ID
exports.updateAttributeById = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.title) {
            updates.code = slugify(updates.title, { lower: true, strict: true });
        }

        const attribute = await Attributes.findByIdAndUpdate(req.params.id, updates, {
            new: true, // Returns the updated document
            runValidators: true, // Ensures that validation rules are applied
        });

        if (!attribute) {
            return res.status(404).send({ message: "Attribute not found" });
        }

        res.status(200).send(attribute);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

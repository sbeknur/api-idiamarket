const slugify = require("slugify");
const ShortDescription = require("../models/shortDescription");

// Create a new short description
exports.createShortDescription = async (req, res) => {
    try {
        const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });

        const shortDescription = new ShortDescription({
            ...req.body,
            code: slugifiedTitle,
        });

        await shortDescription.save();
        res.status(201).send(shortDescription);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all short descriptions
exports.getAllShortDescriptions = async (req, res) => {
    try {
        const shortDescriptions = await ShortDescription.find({});
        res.send(shortDescriptions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an existing short description
exports.updateShortDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const shortDescription = await ShortDescription.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!shortDescription) {
            return res.status(404).send({ error: "Short description not found" });
        }

        res.send(shortDescription);
    } catch (error) {
        res.status(400).send(error);
    }
};

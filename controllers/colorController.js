const slugify = require("slugify");
const Color = require("../models/color");

// Create a new Color
exports.createColor = async (req, res) => {
    try {
        const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });

        const color = new Color({
            ...req.body,
            code: slugifiedTitle,
        });

        await color.save();

        res.status(201).send(color);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all Colors
exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.find({});
        res.send(colors);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update a Color by ID
exports.updateColor = async (req, res) => {
    try {
        const colorId = req.params.id;
        const updatedData = req.body;

        if (updatedData.title) {
            updatedData.code = slugify(updatedData.title, { lower: true, strict: true });
        }

        const color = await Color.findByIdAndUpdate(colorId, updatedData, { new: true, runValidators: true });

        if (!color) {
            return res.status(404).send({ error: "Color not found" });
        }

        res.send(color);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};


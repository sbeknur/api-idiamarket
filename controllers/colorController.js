const slugify = require("slugify");
const Color = require("../models/color");

// Get all Colors
exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.find({});
        res.send(colors);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

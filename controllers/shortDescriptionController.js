const slugify = require("slugify");
const ShortDescription = require("../models/shortDescription");

// Get all short descriptions
exports.getAllShortDescriptions = async (req, res) => {
    try {
        const shortDescriptions = await ShortDescription.find({});
        res.send(shortDescriptions);
    } catch (error) {
        res.status(500).send(error);
    }
};

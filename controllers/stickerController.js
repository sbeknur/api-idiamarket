const slugify = require("slugify");
const Sticker = require("../models/sticker");

// Create a new Sticker
exports.createSticker = async (req, res) => {
    try {
        const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });

        const sticker = new Sticker({
            ...req.body,
            slug: slugifiedTitle,
        });

        await sticker.save();
        res.status(201).send(sticker);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all Stickers
exports.getAllStickers = async (req, res) => {
    try {
        const stickers = await Sticker.find({});
        res.send(stickers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

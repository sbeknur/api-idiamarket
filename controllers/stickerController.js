const slugify = require("slugify");
const Sticker = require("../models/sticker");


// Get all Stickers
exports.getAllStickers = async (req, res) => {
    try {
        const stickers = await Sticker.find({});
        res.send(stickers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    text_color: {
        type: String,
        default: "#ffffff",
    },
    background_color: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Sticker", stickerSchema);

const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    color_type: {
        type: Number,
    },
    hex: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Color", colorSchema);

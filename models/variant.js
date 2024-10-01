const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
    is_available: {
        type: Boolean,
        default: true,
    },
    attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeItem",
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
    },
});

module.exports = mongoose.model("Variant", variantSchema);

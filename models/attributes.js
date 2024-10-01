const mongoose = require("mongoose");

const attributesSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: false,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AttributeItem",
        },
    ],
});

module.exports = mongoose.model("Attributes", attributesSchema);

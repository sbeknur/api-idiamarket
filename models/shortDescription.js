const mongoose = require("mongoose");

const shortDescriptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
});

module.exports = mongoose.model("ShortDescription", shortDescriptionSchema);

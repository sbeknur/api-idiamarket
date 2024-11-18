const express = require("express");
const router = express.Router();
const { createSticker, getAllStickers } = require("../controllers/stickerController");

// Create a new sticker
router.post("/sticker", createSticker);

// Get all stickers
router.get("/stickers", getAllStickers);

module.exports = router;

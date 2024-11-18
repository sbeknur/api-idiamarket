const express = require("express");
const router = express.Router();
const { createSticker, getAllStickers } = require("../controllers/stickerController");

// Get all stickers
router.get("/stickers", getAllStickers);

module.exports = router;

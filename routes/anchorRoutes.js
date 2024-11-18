const express = require("express");
const router = express.Router();
const anchorController = require("../controllers/anchorController");

router.get("/anchors", anchorController.getAllAnchors);

router.get("/anchor/:id", anchorController.getAnchorById);

module.exports = router;

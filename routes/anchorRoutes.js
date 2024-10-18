const express = require("express");
const router = express.Router();
const anchorController = require("../controllers/anchorController");

router.get("/anchors", anchorController.getAllAnchors);

router.get("/anchor/:id", anchorController.getAnchorById);

router.post("/anchor", anchorController.createAnchor);

router.put("/anchor/:id", anchorController.updateAnchor);

router.delete("/anchor/:id", anchorController.deleteAnchor);

module.exports = router;

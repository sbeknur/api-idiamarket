// routes/descriptionRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllDescriptions,
  getDescription,
} = require("../controllers/descriptionController");


router.get("/descriptions", getAllDescriptions);

// GET /api/descriptions/:sku - получение описания по SKU
router.get("/descriptions/:sku", getDescription);


module.exports = router;

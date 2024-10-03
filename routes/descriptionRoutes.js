// routes/descriptionRoutes.js

const express = require("express");
const router = express.Router();
const { createDescription, getAllDescriptions, getDescription, updateDescription } = require("../controllers/descriptionController");

// POST /api/descriptions - создание нового описания
router.post("/descriptions", createDescription);

router.get("/descriptions", getAllDescriptions);

// GET /api/descriptions/:sku - получение описания по SKU
router.get("/descriptions/:sku", getDescription);

// PUT /api/descriptions/:sku - обновление описания по SKU
router.put("/descriptions/:sku", updateDescription);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createCategory, getCategoryById, getAllCategories, updateCategory, deleteCategory, getCategoryAndProductsByCategoryCode, getCategoryFilterOptions, countProductsByCategoryCodes, getBreadcrumbs } = require("../controllers/categoryController");

// Create a new Category
router.post("/category", createCategory);

// Get all Categories
router.get("/categories", getAllCategories);

// Get a single Category by ID
router.get("/category/:id", getCategoryById);

// Update a Category by ID
router.put("/category/:id", updateCategory);

// Delete a Category by ID
router.delete("/category/:id", deleteCategory);

router.get("/categories/:category_code/filters", getCategoryFilterOptions);

// Get Product Count by Category Code
router.get("/categories/:category_code", getCategoryAndProductsByCategoryCode);

router.post("/categories/count", countProductsByCategoryCodes);

router.get("/breadcrumbs/:category_code", getBreadcrumbs);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getCategoryById,
  getAllCategories,
  getCategoryAndProductsByCategoryCode,
  getCategoryFilterOptions,
  countProductsByCategoryCodes,
  getBreadcrumbs,
} = require("../controllers/categoryController");


// Get all Categories
router.get("/categories", getAllCategories);

// Get a single Category by ID
router.get("/category/:id", getCategoryById);


router.get("/categories/:category_code/filters", getCategoryFilterOptions);

// Get Product Count by Category Code
router.get("/categories/:category_code", getCategoryAndProductsByCategoryCode);

router.post("/categories/count", countProductsByCategoryCodes);

router.get("/breadcrumbs/:category_code", getBreadcrumbs);

module.exports = router;

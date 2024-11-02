const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductByUri,
  getAllProducts,
  getPopularProducts,
  updateProductById,
  getDayProducts,
  searchProducts,
  deleteProductById,
  updateProductBySku,
  getSearchFilterOptions,
  getProductsBySku,
} = require("../controllers/productController");

// Create a new Product
router.post("/product", createProduct);

// Get all Products
router.get("/products", getAllProducts);

// Get the most popular products
router.get("/products/popular", getPopularProducts);

router.get("/products/day", getDayProducts);

// Get a single Product by URI
router.get("/product/:uri", getProductByUri);

// Update a Product by ID
router.put("/product/:id", updateProductById);

// Update a Product by SKU
router.put("/product/sku/:sku", updateProductBySku);

// Search Products by query
router.get("/products/search", searchProducts);

//Get filter options for search
router.get("/products/search/filters", getSearchFilterOptions);

// Get Products by SKU
router.get("/products/sku", getProductsBySku);

// Delete a Product by ID
router.delete("/product/:id", deleteProductById);

module.exports = router;

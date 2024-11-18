const express = require("express");
const router = express.Router();
const {  getProductByUri, getAllProducts, getPopularProducts, getDayProducts, searchProducts, getSearchFilterOptions } = require("../controllers/productController");

// Get all Products
router.get("/products", getAllProducts);

// Get the most popular products
router.get("/products/popular", getPopularProducts);

router.get("/products/day", getDayProducts);

// Get a single Product by URI
router.get("/product/:uri", getProductByUri);

// Search Products by query
router.get("/products/search", searchProducts);

//Get filter options for search
router.get("/products/search/filters", getSearchFilterOptions);


module.exports = router;

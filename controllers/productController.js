const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");

// Create a new Product
exports.createProduct = async (req, res) => {
  try {
    const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
    const productUri = `${slugifiedTitle}-${req.body.sku}`;

    const product = new Product({
      ...req.body,
      uri: productUri,
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get all Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("color").populate("categories").populate("short_description").populate("attributes").populate("variants.attributes").populate("stickers").populate("meta_data");
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update a Product by ID
exports.updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // If title or SKU is being updated, regenerate the `uri`
    let updatedData = { ...req.body };
    if (req.body.title || req.body.sku) {
      const slugifiedTitle = slugify(req.body.title || req.body.originalTitle, { lower: true, strict: true });
      const productUri = `${slugifiedTitle}-${req.body.sku || req.body.originalSku}`;
      updatedData.uri = productUri;
    }

    const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).send({ error: error.message });
    }

    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update a Product by SKU
exports.updateProductBySku = async (req, res) => {
  try {
    const productSku = req.params.sku;

    // If title is being updated, regenerate the `uri`
    let updatedData = { ...req.body };
    if (req.body.title) {
      const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
      const productUri = `${slugifiedTitle}-${productSku}`;
      updatedData.uri = productUri;
    }

    const product = await Product.findOneAndUpdate({ sku: productSku }, updatedData, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get a single Product by URI
exports.getProductByUri = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { uri: req.params.uri },
      { $inc: { view_count: 1 } }, // Увеличить view_count на 1
      { new: true }
    )
      .populate("color")
      .populate("categories")
      .populate("short_description")
      .populate({
        path: "attributes",
        populate: {
          path: "items",
          model: "AttributeItem",
        },
      })
      .populate({
        path: "variants",
        populate: [
          {
            path: "attributes",
            populate: {
              path: "attribute",
              model: "AttributeItem",
            },
          },
          {
            path: "colors",
            populate: {
              path: "color",
              model: "Color",
            },
          },
        ],
      })
      .populate("stickers")
      .populate("meta_data");

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get the most popular products by view count
exports.getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find({})
      .sort({ view_count: -1 }) // Sort by view_count in descending order
      .limit(6) // Limit the results to 6 products
      .populate("color")
      .populate("categories")
      .populate("short_description")
      .populate("attributes")
      .populate("variants.attributes")
      .populate("stickers")
      .populate("meta_data");

    res.send(popularProducts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get 4 random products that refresh daily
exports.getDayProducts = async (req, res) => {
  try {
    // Select 4 random products using aggregation
    const randomDayProducts = await Product.aggregate([{ $sample: { size: 4 } }]).exec();

    // Populate the necessary fields
    const populatedProducts = await Product.populate(randomDayProducts, [{ path: "color" }, { path: "categories" }, { path: "short_description" }, { path: "attributes" }, { path: "variants.attributes" }, { path: "stickers" }, { path: "meta_data" }]);

    res.send(populatedProducts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Search Products by query
exports.searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    console.log("Search query received:", searchQuery);

    if (!searchQuery) {
      return res.status(400).send({ error: "Search query is required." });
    }

    // Get page and limit from query parameters with defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Initialize sort options with a default value
    let sortOptions = { view_count: -1 };

    switch (req.query.sorting) {
      case "popular":
        sortOptions = { view_count: -1 };
        break;
      case "discount":
        sortOptions = { discount: -1 };
        break;
      case "created_at":
        sortOptions = { date: -1 };
        break;
      case "priceAsc":
        sortOptions = { priceAsDouble: 1 };
        break;
      case "priceDesc":
        sortOptions = { priceAsDouble: -1 };
        break;
      default:
        break; // If none of the cases match, the default sortOptions will be used
    }

    const products = await Product.aggregate([
      {
        $match: {
          title: { $regex: searchQuery, $options: "i" },
        },
      },
      {
        $addFields: {
          priceAsDouble: { $toDouble: "$price" },
        },
      },
      { $sort: sortOptions },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "colors",
          localField: "color",
          foreignField: "_id",
          as: "color",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "attributes",
          localField: "attributes",
          foreignField: "_id",
          as: "attributes",
        },
      },
      {
        $lookup: {
          from: "stickers",
          localField: "stickers",
          foreignField: "_id",
          as: "stickers",
        },
      },
      {
        $lookup: {
          from: "meta_data",
          localField: "meta_data",
          foreignField: "_id",
          as: "meta_data",
        },
      },
    ]);

    // Count total products for pagination
    const totalProducts = await Product.countDocuments({
      title: { $regex: searchQuery, $options: "i" },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    if (!products || products.length === 0) {
      console.log("No products found for query:", searchQuery);
      return res.status(404).send({ error: "No products found for this search query." });
    }

    // Send the response with products and pagination details
    res.send({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send({ error: error.message });
  }
};

// Get all filter options by search query
exports.getSearchFilterOptions = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    console.log("Received search query:", searchQuery);

    console.log("Full request query:", req.query);

    if (!searchQuery) {
      return res.status(400).send({ error: "Search query is required." });
    }

    // Find all products that match the search query
    const products = await Product.find({
      title: { $regex: searchQuery, $options: "i" }, // 'i' makes the search case-insensitive
      is_enabled: true,
    })
      .populate("color")
      .populate({
        path: "attributes",
        populate: {
          path: "items",
          model: "AttributeItem",
        },
      });

    // Check if products are found
    if (!products || products.length === 0) {
      console.log("No products found matching the query:", searchQuery);
      return res.status(404).send({ error: "No products found for this search query." });
    }

    console.log(`Found ${products.length} products for query "${searchQuery}"`);

    // Aggregate price range
    const prices = products.map((product) => parseFloat(product.price)).filter((price) => !isNaN(price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    // Aggregate unique colors
    const colors = products
      .filter((product) => product.color)
      .map((product) => ({
        code: product.color.code,
        title: product.color.title,
        hex: product.color.hex,
      }));
    const uniqueColors = Array.from(new Map(colors.map((c) => [c.code, c])).values());

    // Aggregate unique attributes
    const attributeItemMap = {};
    products.forEach((product, productIndex) => {
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach((attribute, attributeIndex) => {
          if (attribute.items && Array.isArray(attribute.items)) {
            attribute.items.forEach((item) => {
              if (!attributeItemMap[item.code]) {
                attributeItemMap[item.code] = {
                  title: item.title,
                  display_type: item.display_type,
                  values: new Set(),
                };
              }
              attributeItemMap[item.code].values.add(item.value);
            });
          } else {
            console.warn(`Attribute items are undefined or not an array for productIndex ${productIndex}, attributeIndex ${attributeIndex}`);
          }
        });
      } else {
        console.warn(`Product attributes are undefined or not an array for productIndex ${productIndex}`);
      }
    });

    const groupedAttributes = Object.keys(attributeItemMap).map((code) => ({
      code,
      title: attributeItemMap[code].title,
      display_type: attributeItemMap[code].display_type,
      values: Array.from(attributeItemMap[code].values),
    }));

    // Send response with filter options
    res.send({
      priceRange: [minPrice, maxPrice],
      colors: uniqueColors,
      attributes: groupedAttributes,
    });
  } catch (error) {
    console.error("Error during filter option aggregation:", error);
    res.status(500).send({ error: error.message });
  }
};

// Delete a Product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

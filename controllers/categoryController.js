const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const Color = require("../models/color");
const AttributeItem = require("../models/attributeItem");
const Attributes = require("../models/attributes");
const seoMetadata = require("../models/seoMetadata");

// Create a new Category
async function buildUri(parentId, slugifiedTitle) {
  if (!parentId) {
    return slugifiedTitle;
  }

  const parentCategory = await Category.findById(parentId);

  if (!parentCategory) {
    throw new Error("Parent category not found");
  }

  const parentUri = await buildUri(parentCategory.parent, parentCategory.category_code);

  return `${parentUri}/${slugifiedTitle}`;
}

exports.createCategory = async (req, res) => {
  try {
    const slugifiedTitle = slugify(req.body.title, { lower: true, strict: true });
    let categoryUri = slugifiedTitle;

    if (req.body.parent) {
      categoryUri = await buildUri(req.body.parent, slugifiedTitle);
    }

    const category = new Category({
      ...req.body,
      category_code: slugifiedTitle,
      uri: categoryUri,
    });

    await category.save();

    if (req.body.parent) {
      await Category.findByIdAndUpdate(req.body.parent, {
        $push: { children: category._id },
      });
    }

    res.status(201).send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a Category by ID
exports.updateCategory = async (req, res) => {
  try {
    const updates = req.body;

    // If title is being updated, regenerate category_code
    if (updates.title) {
      updates.category_code = slugify(updates.title, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { children: category._id },
      });
    }

    res.send({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get Products by Category Code with Attribute Filters
exports.getCategoryAndProductsByCategoryCode = async (req, res) => {
  try {
    const categoryCode = req.params.category_code;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Infinity;

    // Split color query parameter by commas to handle multiple color selections
    const colorCodes = req.query.colors ? req.query.colors.split(",").filter(Boolean) : [];

    // Extract attributes from query parameters for filtering
    let attributeFilters = {};
    Object.keys(req.query).forEach((key) => {
      // Assuming attribute codes like "vysota-mm" will be part of the query keys
      if (key !== "page" && key !== "limit" && key !== "minPrice" && key !== "maxPrice" && key !== "colors") {
        const value = req.query[key];
        if (typeof value === "string") {
          attributeFilters[key] = value.split(",");
        } else if (Array.isArray(value)) {
          attributeFilters[key] = value; // Use the array directly
        }
      }
    });

    // Find the category by category code
    const category = await Category.findOne({ category_code: categoryCode })
      .populate({
        path: "children",
        model: "Category",
      })
      .populate({
        path: "meta_data",
        model: "SeoMetadata",
      });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    // Initialize the color filter
    let colorFilter = {};
    if (colorCodes.length > 0) {
      // Find the colors by their codes
      const colors = await Color.find({ code: { $in: colorCodes } });
      if (colors.length > 0) {
        // Extract the color IDs
        const colorIds = colors.map((color) => color._id);
        colorFilter = { color: { $in: colorIds } };
      }
    }

    // Initialize attribute filters
    let attributeConditions = [];
    if (Object.keys(attributeFilters).length > 0) {
      for (const [attributeCode, values] of Object.entries(attributeFilters)) {
        // Find matching AttributeItems for the given code and values
        const matchingItems = await AttributeItem.find({
          code: attributeCode,
          attribute_values: { $in: values },
          is_active: true, // Only active attribute items
        });

        if (matchingItems.length > 0) {
          const attributeItemIds = matchingItems.map((item) => item._id);

          // Find corresponding Attributes that contain these AttributeItems
          const matchingAttributes = await Attributes.find({
            items: { $in: attributeItemIds },
          });

          if (matchingAttributes.length > 0) {
            const attributeIds = matchingAttributes.map((attr) => attr._id);
            attributeConditions.push({ attributes: { $in: attributeIds } });
          }
        }
      }
    }

    // Combine all attribute conditions into a single filter if any exist
    let attributeFilter = {};
    if (attributeConditions.length > 0) {
      attributeFilter = { $and: attributeConditions };
    }

    // Find products with the category ID and other filters
    const products = await Product.find({
      categories: category._id,
      $expr: {
        $and: [{ $gte: [{ $toDouble: "$price" }, minPrice] }, { $lte: [{ $toDouble: "$price" }, maxPrice] }],
      },
      is_enabled: true, // Only enabled products
      ...colorFilter, // Apply the color filter
      ...attributeFilter, // Apply the attribute filter
    })
      .populate("color")
      .populate("categories")
      .populate("short_description")
      .populate({
        path: "attributes",
        model: "Attributes",
        populate: {
          path: "items",
          model: "AttributeItem",
        },
      })
      .populate("variants.attributes")
      .populate("stickers")
      .populate("meta_data")
      .skip(skip)
      .limit(limit);

    // Count total products for pagination
    const totalProducts = await Product.countDocuments({
      categories: category._id,
      $expr: {
        $and: [{ $gte: [{ $toDouble: "$price" }, minPrice] }, { $lte: [{ $toDouble: "$price" }, maxPrice] }],
      },
      is_enabled: true, // Only enabled products
      ...colorFilter, // Apply the color filter for counting
      ...attributeFilter, // Apply the attribute filter for counting
    });

    const totalPages = Math.ceil(totalProducts / limit);

    // Send the response
    res.send({
      category,
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all filter options by category
exports.getCategoryFilterOptions = async (req, res) => {
  try {
    const categoryCode = req.params.category_code;

    // Find category
    const category = await Category.findOne({ category_code: categoryCode });

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    // Find all products in the category (without pagination)
    const products = await Product.find({
      categories: category._id,
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

    // Ensure products is not undefined
    if (!products || products.length === 0) {
      return res.status(404).send({ error: "No products found for this category" });
    }

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
      // Ensure product.attributes exists and is an array
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach((attribute, attributeIndex) => {
          // Check if attribute.items exists and is an array
          if (attribute.items && Array.isArray(attribute.items)) {
            attribute.items.forEach((item) => {
              // Group by item.code
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

    res.send({
      priceRange: [minPrice, maxPrice],
      colors: uniqueColors,
      attributes: groupedAttributes,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Count Products by Category Code
exports.countProductsByCategoryCodes = async (req, res) => {
  try {
    const categoryCodes = req.body.category_codes;
    const categories = await Category.find({ category_code: { $in: categoryCodes } });
    const counts = {};

    for (const category of categories) {
      const productCount = await Product.countDocuments({ categories: category._id });
      counts[category.category_code] = productCount;
    }

    res.send(counts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Controller function to get breadcrumbs by category_code
exports.getBreadcrumbs = async (req, res) => {
  const { category_code } = req.params;

  try {
    const breadcrumbs = await buildBreadcrumbs(category_code);
    res.json(breadcrumbs);
  } catch (error) {
    console.error("Error fetching breadcrumbs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const buildBreadcrumbs = async (category_code) => {
  let breadcrumbs = [];

  let category = await Category.findOne({ category_code }).populate("parent");

  while (category) {
    breadcrumbs.unshift({
      name: category.title,
      path: `/${category.source}/${category.uri}`,
    });

    if (category.parent) {
      category = await Category.findById(category.parent._id).populate("parent");
    } else {
      category = null;
    }
  }

  return breadcrumbs;
};

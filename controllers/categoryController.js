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

    const colorCodes = req.query.colors ? req.query.colors.split(",").filter(Boolean) : [];

    let attributeFilters = {};
    Object.keys(req.query).forEach((key) => {
      if (key !== "page" && key !== "limit" && key !== "minPrice" && key !== "maxPrice" && key !== "colors" && key !== "sort") {
        const value = req.query[key];
        if (typeof value === "string") {
          attributeFilters[key] = value.split(",");
        } else if (Array.isArray(value)) {
          attributeFilters[key] = value;
        }
      }
    });

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

    let colorFilter = {};
    if (colorCodes.length > 0) {
      const colors = await Color.find({ code: { $in: colorCodes } });
      if (colors.length > 0) {
        const colorIds = colors.map((color) => color._id);
        colorFilter = { color: { $in: colorIds } };
      }
    }

    let attributeConditions = [];
    if (Object.keys(attributeFilters).length > 0) {
      for (const [attributeCode, values] of Object.entries(attributeFilters)) {
        const matchingItems = await AttributeItem.find({
          code: attributeCode,
          attribute_values: { $in: values },
          is_active: true,
        });

        if (matchingItems.length > 0) {
          const attributeItemIds = matchingItems.map((item) => item._id);

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

    let attributeFilter = {};
    if (attributeConditions.length > 0) {
      attributeFilter = { $and: attributeConditions };
    }

    // Initialize sort options
    let sortOptions = {};
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
        break;
    }

    // Use aggregation pipeline to properly handle price conversion and sorting
    const products = await Product.aggregate([
      {
        $match: {
          categories: category._id,
          is_enabled: true,
          $expr: {
            $and: [{ $gte: [{ $toDouble: "$price" }, minPrice] }, { $lte: [{ $toDouble: "$price" }, maxPrice] }],
          },
          ...colorFilter,
          ...attributeFilter,
        },
      },
      {
        $addFields: {
          priceAsDouble: { $toDouble: "$price" }, // Convert price to double
        },
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
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

    const totalProducts = await Product.countDocuments({
      categories: category._id,
      $expr: {
        $and: [{ $gte: [{ $toDouble: "$price" }, minPrice] }, { $lte: [{ $toDouble: "$price" }, maxPrice] }],
      },
      is_enabled: true,
      ...colorFilter,
      ...attributeFilter,
    });

    const totalPages = Math.ceil(totalProducts / limit);

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

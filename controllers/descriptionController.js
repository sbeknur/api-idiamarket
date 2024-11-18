const Description = require("../models/description");


// Получение описания по SKU
exports.getDescription = async (req, res) => {
  const { sku } = req.params;

  try {
    // Ищем описание по SKU
    const description = await Description.findOne({ sku });

    if (!description) {
      return res.status(404).json({ message: "Description not found" });
    }

    res.status(200).json(description);
  } catch (error) {
    res.status(500).json({ message: "Error fetching description", error });
  }
};


// Получение всех описаний
exports.getAllDescriptions = async (req, res) => {
  try {
    // Ищем все описания
    const descriptions = await Description.find();

    res.status(200).json(descriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching descriptions", error });
  }
};

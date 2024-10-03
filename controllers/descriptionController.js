const Description = require("../models/description");

// Создание нового описания
exports.createDescription = async (req, res) => {
  const { sku, html_content } = req.body;

  try {
    // Проверяем, есть ли уже описание с таким SKU
    const existingDescription = await Description.findOne({ sku });
    if (existingDescription) {
      return res.status(400).json({ message: "Description with this SKU already exists." });
    }

    // Создаем новое описание
    const newDescription = new Description({ sku, html_content });
    await newDescription.save();

    res.status(201).json({ message: "Description created successfully!", description: newDescription });
  } catch (error) {
    res.status(500).json({ message: "Error creating description", error });
  }
};

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

// Обновление описания по SKU
exports.updateDescription = async (req, res) => {
  const { sku } = req.params;
  const { html_content } = req.body;

  try {
    // Ищем описание и обновляем его
    const updatedDescription = await Description.findOneAndUpdate({ sku }, { html_content }, { new: true, runValidators: true });

    if (!updatedDescription) {
      return res.status(404).json({ message: "Description not found" });
    }

    res.status(200).json({ message: "Description updated successfully!", description: updatedDescription });
  } catch (error) {
    res.status(500).json({ message: "Error updating description", error });
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

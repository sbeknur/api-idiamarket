const Anchor = require("../models/anchor");

// Получение всех анкерных ссылок
exports.getAllAnchors = async (req, res) => {
  try {
    const anchors = await Anchor.find();
    res.status(200).json(anchors);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении анкерных ссылок", error: error.message });
  }
};

// Получение анкерной ссылки по ID
exports.getAnchorById = async (req, res) => {
  try {
    const anchor = await Anchor.findById(req.params.id);
    if (!anchor) {
      return res.status(404).json({ message: "Анкерная ссылка не найдена" });
    }
    res.status(200).json(anchor);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении анкерной ссылки", error: error.message });
  }
};

// Создание новой анкерной ссылки
exports.createAnchor = async (req, res) => {
  const { title, uri } = req.body;
  const newAnchor = new Anchor({ title, uri });

  try {
    const savedAnchor = await newAnchor.save();
    res.status(201).json(savedAnchor);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при создании анкерной ссылки", error: error.message });
  }
};

// Обновление анкерной ссылки по ID
exports.updateAnchor = async (req, res) => {
  const { title, uri } = req.body;

  try {
    const updatedAnchor = await Anchor.findByIdAndUpdate(req.params.id, { title, uri }, { new: true });

    if (!updatedAnchor) {
      return res.status(404).json({ message: "Анкерная ссылка не найдена" });
    }
    res.status(200).json(updatedAnchor);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении анкерной ссылки", error: error.message });
  }
};

// Удаление анкерной ссылки по ID
exports.deleteAnchor = async (req, res) => {
  try {
    const deletedAnchor = await Anchor.findByIdAndDelete(req.params.id);
    if (!deletedAnchor) {
      return res.status(404).json({ message: "Анкерная ссылка не найдена" });
    }
    res.status(204).send(); // Успешно удалено
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении анкерной ссылки", error: error.message });
  }
};

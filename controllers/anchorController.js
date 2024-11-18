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

const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");

router.get("/faqs", faqController.getAllFaqs);

router.post("/faq", faqController.createFaq);

router.put("/faq/:id", faqController.updateFaq);

router.delete("/faq/:id", faqController.deleteFaq);

module.exports = router;

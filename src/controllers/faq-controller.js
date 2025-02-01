const FAQ = require("../models/faq");
const translateText = require("../utils/translate");

const handleFaqRetrieval = async (req, res) => {
  try {
    const lang = req.query.lang;
    const id = req.params.id;
    if (id) {
      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({
          error: "FAQ not found",
        });
      }
      const data = faq.getTranslatedText(lang);
      return res.status(200).json(data);
    }

    const faqs = await FAQ.find();
    let data = [];
    faqs.forEach((faq) => {
      data.push(faq.getTranslatedText(lang));
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveFaq = async (req, res) => {
  try {
    if (!req.body.question || !req.body.answer) {
      return res.status(400).json({
        error: "Please provide valid faq",
      });
    }
    const translations = await translateText(req.body);

    const faq = new FAQ({
      question: req.body.question,
      answer: req.body.answer,
      translations,
    });

    console.log(faq, translations);

    await faq.save();

    return res.status(200).json({
      message: "FAQ saved successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleFaqRetrieval,
  saveFaq,
};

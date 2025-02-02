const FAQ = require("../models/faq");
const redisClient = require("../config/cache");
const translateText = require("../utils/translate");

const handleFaqRetrieval = async (req, res) => {
  try {
    let lang = req.query.lang || "en";
    const id = req.params.id;

    if (!["en", "hi", "bn"].includes(lang)) lang = "en";

    if (id) {
      const cacheKey = `faq_${id}_${lang}`;

      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit: Single FAQ");
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log("Cache miss: Fetching from DB...");
      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }

      const data = faq.getTranslatedText(lang);

      await redisClient.setEx(cacheKey, 600, JSON.stringify(data));
      return res.status(200).json(data);
    }

    const cacheKey = `faqs_${lang}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit: All FAQs");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Cache miss: Fetching all FAQs from DB...");
    const faqs = await FAQ.find();
    const data = faqs.map((faq) => faq.getTranslatedText(lang));

    await redisClient.setEx(cacheKey, 600, JSON.stringify(data));

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err);
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

    await faq.save();

    await redisClient.del("faqs_en", "faqs_hi", "faqs_bn");

    return res.status(200).json({
      message: "FAQ saved successfully",
      data: faq,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleFaqUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || (!req.body.question && !req.body.answer)) {
      return res.status(400).json({
        error: "Please provide valid faq",
      });
    }
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({
        error: "FAQ not found",
      });
    }
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;

    await faq.save();

    await redisClient.del(
      `faq_${id}_en`,
      `faq_${id}_hi`,
      `faq_${id}_bn`,
      "faqs_en",
      "faqs_hi",
      "faqs_bn",
    );

    return res.status(200).json({
      message: "FAQ updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const id = req.params.id;
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({
        error: "FAQ not found",
      });
    }
    await FAQ.findByIdAndDelete(id);

    await redisClient.del(
      `faq_${id}_en`,
      `faq_${id}_hi`,
      `faq_${id}_bn`,
      "faqs_en",
      "faqs_hi",
      "faqs_bn",
    );

    return res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleFaqRetrieval,
  saveFaq,
  handleFaqUpdate,
  deleteFaq,
};

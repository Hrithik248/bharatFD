const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    translations: {
      question_hi: {
        type: String,
      },
      answer_hi: {
        type: String,
      },
      question_bn: {
        type: String,
      },
      answer_bn: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

faqSchema.methods.getTranslatedText = function (lang) {
  if (lang === "bn")
    return {
      question: this.translations.question_bn,
      answer: this.translations.answer_bn,
    };
  if (lang === "hi")
    return {
      question: this.translations.question_hi,
      answer: this.translations.answer_hi,
    };
  return { question: this.question, answer: this.answer };
};

const FAQ = mongoose.model("FAQ", faqSchema);
module.exports = FAQ;

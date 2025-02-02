const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate();

const translateText = async (faq) => {
  if (!faq.question || !faq.answer) {
    return {
      error: "Please provide valid faq ",
    };
  }

  try {
    const [hindiQuestion] = await translate.translate(faq.question, "hi");
    const [hindiAnswer] = await translate.translate(faq.answer, "hi");
    const [bengaliQuestion] = await translate.translate(faq.question, "bn");
    const [bengaliAnswer] = await translate.translate(faq.answer, "bn");

    return {
      question_hi: hindiQuestion,
      answer_hi: hindiAnswer,
      question_bn: bengaliQuestion,
      answer_bn: bengaliAnswer,
    };
  } catch (error) {
    console.error("Error during translation:", error);
  }
};

module.exports = translateText;

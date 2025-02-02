const Faq = require("../models/faq");

const adminSetup = async (app) => {
  try {
    const AdminJS = (await import("adminjs")).default;
    const AdminJSExpress = (await import("@adminjs/express")).default;
    const AdminJSMongoose = await import("@adminjs/mongoose");

    AdminJS.registerAdapter({
      Database: AdminJSMongoose.Database,
      Resource: AdminJSMongoose.Resource,
    });

    const adminJs = new AdminJS({
      resources: [
        {
          resource: Faq,
          options: {
            properties: {
              question: { type: "string" },
              answer: { type: "richtext" },
              "translations.question_hi": { type: "string" },
              "translations.answer_hi": { type: "richtext" },
              "translations.question_bn": { type: "string" },
              "translations.answer_bn": { type: "richtext" },
            },
            listProperties: ["question", "answer"],
            editProperties: [
              "question",
              "answer",
              "translations.question_hi",
              "translations.answer_hi",
              "translations.question_bn",
              "translations.answer_bn",
            ],
          },
        },
      ],
      rootPath: "/admin",
    });

    const router = AdminJSExpress.buildRouter(adminJs);
    app.use(adminJs.options.rootPath, router);
  } catch (error) {
    console.error("Error in adminSetup:", error);
    throw error;
  }
};

module.exports = adminSetup;

const express = require("express");
const router = express.Router();

const controllers = require("../controllers/faq-controller");

router.get("/faqs/:id?", controllers.handleFaqRetrieval);

router.post("/faqs", controllers.saveFaq);

router.patch("/faqs/:id", controllers.handleFaqUpdate);

router.delete("/faqs/:id", controllers.deleteFaq);

module.exports = router;

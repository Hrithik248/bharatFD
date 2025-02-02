const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const redisClient = require("../src/config/cache");
const FAQ = require("../src/models/faq");
const { expect } = chai;
const sinon = require("sinon");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("GET /api/faqs/:id", function () {
  let redisGetStub;
  let testFaq;

  before(function () {
    redisGetStub = sinon
      .stub(redisClient, "get")
      .callsFake(() => Promise.resolve(null));
  });

  after(async function () {
    redisGetStub.restore();
    await testFaq.deleteOne();
  });

  it("should retrieve an FAQ by ID in the specified language", async function () {
    testFaq = await FAQ.create({
      question: "What is Node.js?",
      answer: "Node.js is a JavaScript runtime.",
      translations: {
        question_hi: "Node.js क्या है?",
        answer_hi:
          "Node.js एक ओपन-सोर्स, क्रॉस-प्लेटफ़ॉर्म जावास्क्रिप्ट रनटाइम वातावरण है|",
        question_bn: "Node.js কি?",
        answer_bn: "Node.js একটি জাভাস্ক্রিপ্ট রানটাইম।",
      },
    });

    await redisClient.del(`faq_${testFaq._id}_en`);
    await redisClient.del(`faq_${testFaq._id}_hi`);
    await redisClient.del(`faq_${testFaq._id}_bn`);

    const resEnglish = await chai
      .request(app)
      .get(`/api/faqs/${testFaq._id}?lang=en`);

    const resHindi = await chai
      .request(app)
      .get(`/api/faqs/${testFaq._id}?lang=hi`);

    const resBengali = await chai
      .request(app)
      .get(`/api/faqs/${testFaq._id}?lang=bn`);

    expect(resEnglish.status).to.equal(200);
    expect(resHindi.status).to.equal(200);
    expect(resBengali.status).to.equal(200);
    expect(resEnglish.body)
      .to.have.property("question")
      .equal("What is Node.js?");
    expect(resEnglish.body)
      .to.have.property("answer")
      .equal("Node.js is a JavaScript runtime.");
    expect(resHindi.body)
      .to.have.property("question")
      .equal("Node.js क्या है?");
    expect(resHindi.body)
      .to.have.property("answer")
      .equal(
        "Node.js एक ओपन-सोर्स, क्रॉस-प्लेटफ़ॉर्म जावास्क्रिप्ट रनटाइम वातावरण है|",
      );
    expect(resBengali.body).to.have.property("question").equal("Node.js কি?");
    expect(resBengali.body)
      .to.have.property("answer")
      .equal("Node.js একটি জাভাস্ক্রিপ্ট রানটাইম।");
  });

  it("should return 404 if FAQ does not exist", async function () {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await chai.request(app).get(`/api/faqs/${nonExistentId}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").equal("FAQ not found");
  });
});

describe("POST /api/faqs", function () {
  let testFaq;

  after(async function () {
    await FAQ.findByIdAndDelete(testFaq._id);
  });

  it("should save a new FAQ and return a success message", async function () {
    const newFaq = {
      question: "What is Express.js?",
      answer: "Express.js is a web framework for Node.js.",
    };

    const res = await chai.request(app).post("/api/faqs").send(newFaq);

    testFaq = res.body.data;

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("FAQ saved successfully");
    expect(res.body.data)
      .to.have.property("question")
      .equal("What is Express.js?");
    expect(res.body.data)
      .to.have.property("answer")
      .equal("Express.js is a web framework for Node.js.");
  });

  it("should return 400 if question or answer is missing", async function () {
    const res = await chai.request(app).post("/api/faqs").send({});
    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Please provide valid faq");
  });
});

describe("PATCH /api/faqs/:id", function () {
  let testFaq;

  after(async function () {
    await testFaq.deleteOne();
  });

  it("should update an FAQ successfully", async function () {
    const faq = await FAQ.create({
      question: "What is MongoDB?",
      answer: "MongoDB is a NoSQL database.",
      translations: {
        question_hi: "MongoDB क्या है?",
        answer_hi: "MongoDB एक NoSQL डेटाबेस है|",
        question_bn: "MongoDB কি?",
        answer_bn: "MongoDB একটি NoSQL ডেটাবেস।",
      },
    });

    testFaq = faq;

    const faqUpdate = {
      question: "What is MongoDB (updated)?",
    };

    const res = await chai
      .request(app)
      .patch(`/api/faqs/${faq._id}`)
      .send(faqUpdate);

    const updatedFAQ = await FAQ.findById(faq._id);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("FAQ updated successfully");
    expect(updatedFAQ.question).to.equal("What is MongoDB (updated)?");
  });

  it("should return 400 if no question or answer is sent", async function () {
    const res = await chai
      .request(app)
      .patch(`/api/faqs/${testFaq._id}`)
      .send({});
    expect(res.status).to.equal(400);
    expect(res.body)
      .to.have.property("error")
      .equal("Please provide valid faq");
  });

  it("should return 404 if FAQ not found", async function () {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await chai
      .request(app)
      .patch(`/api/faqs/${nonExistentId}`)
      .send({ question: "What is Redis?" });
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").equal("FAQ not found");
  });
});

describe("DELETE /api/faqs/:id", function () {
  it("should delete an FAQ successfully", async function () {
    const faq = await FAQ.create({
      question: "What is Redis?",
      answer: "Redis is an in-memory data structure store.",
    });

    const res = await chai.request(app).delete(`/api/faqs/${faq._id}`).send();

    const deletedFAQ = await FAQ.findById(faq._id);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("FAQ deleted successfully");
    expect(deletedFAQ).to.equal(null);
  });

  it("should return 404 if FAQ not found", async function () {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await chai.request(app).delete(`/api/faqs/${nonExistentId}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").equal("FAQ not found");
  });
});

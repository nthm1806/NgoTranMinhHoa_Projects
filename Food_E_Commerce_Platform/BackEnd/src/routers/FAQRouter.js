const express = require("express");
const FAQController = require("../controllers/FAQController");

const router = express.Router();

router.get("/popular", FAQController.getPopularFAQs);
router.patch("/increment/:id", FAQController.incrementViewCount);

module.exports = router;

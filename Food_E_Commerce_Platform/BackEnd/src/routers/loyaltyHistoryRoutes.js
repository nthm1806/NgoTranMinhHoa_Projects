const express = require("express");
const router = express.Router();
const LoyaltyHistoryController = require("../controllers/LoyaltyHistoryController");

// API lấy lịch sử loyalty theo customerId
router.get("/:customerId", LoyaltyHistoryController.getLoyaltyHistory);

// API lấy toàn bộ thông tin Tier động từ database
router.get("/tiers/all", LoyaltyHistoryController.getAllTiers);

module.exports = router;

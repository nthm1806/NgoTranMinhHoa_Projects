const express = require("express");
const router = express.Router();
const AffiliateTrackingController = require("../controllers/AffiliateTrackingController");

// API lấy thông tin tiếp thị theo CustomerID
router.get("/stats/:customerId", AffiliateTrackingController.getAffiliateStatsByCustomer);

// API lấy lịch sử tiếp thị
router.get("/history/:customerId", AffiliateTrackingController.getAffiliateHistoryByCustomer);

// API nhập mã tiếp thị
router.post("/track", AffiliateTrackingController.trackAffiliateClick);

module.exports = router;

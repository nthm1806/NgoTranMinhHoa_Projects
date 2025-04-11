const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/supportController');

// Các route cho yêu cầu hỗ trợ
router.post('/request', SupportController.createRequest); // Tạo yêu cầu hỗ trợ
router.get('/request/:id', SupportController.getRequestById); // Lấy chi tiết yêu cầu theo ID
router.get('/requests/:customer_id', SupportController.getUserRequests); // Lấy lịch sử yêu cầu của người dùng
router.get('/categories', SupportController.getRequestCategories); // Lấy danh sách loại yêu cầu
router.put("/request/:id", SupportController.updateRequest); // API cập nhật yêu cầu
router.delete("/request/:id", SupportController.deleteRequest); // API xóa yêu cầu

module.exports = router;

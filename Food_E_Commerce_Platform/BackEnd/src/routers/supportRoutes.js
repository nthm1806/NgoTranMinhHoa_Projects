const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/supportController');

router.get('/request/:id', SupportController.getRequestById); // API lấy chi tiết yêu cầu hỗ trợ
router.post('/request', SupportController.createRequest);
router.get('/requests/:customer_id', SupportController.getUserRequests);
router.get('/categories', SupportController.getRequestCategories);
router.post('/request', SupportController.createRequest);
router.get('/requests/:customer_id', SupportController.getUserRequests);

module.exports = router;

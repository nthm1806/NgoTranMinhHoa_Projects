const express = require('express');
const customerController = require('../controllers/APICustomerController');

const router = express.Router();

// API nhận dữ liệu từ Admin

router.post('/sync', customerController.syncCustomerData);

module.exports = router;

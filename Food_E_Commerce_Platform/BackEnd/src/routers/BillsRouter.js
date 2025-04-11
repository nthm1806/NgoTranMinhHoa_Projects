const express = require('express');
const BillsController = require('../controllers/BillsController');

const router = express.Router();

// API nhận dữ liệu từ Admin

router.get('/All', BillsController.getBillsAll);

module.exports = router;

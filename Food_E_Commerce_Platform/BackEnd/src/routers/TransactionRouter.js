const express = require('express');
const Transaction = require('../controllers/TransactionController')

const router = express.Router();

router.post('/callback',Transaction.callback);
router.post('/check',Transaction.checkPayment)

module.exports = router;
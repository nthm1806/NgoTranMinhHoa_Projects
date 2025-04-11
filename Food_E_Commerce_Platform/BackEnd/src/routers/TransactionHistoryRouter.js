const TransactionHistoryControllers = require('../controllers/TransactionHistoryControllers')
const express = require('express')


const router = express.Router();
// http://localhost:3001/api/Order/CheckOut
router.get('/All',TransactionHistoryControllers.getTransactionHistory);
router.post('/addBillPayment', TransactionHistoryControllers.addBillPayment);

module.exports = router;

const PayBillsControllers = require('../controllers/PayBillsControllers')
const express = require('express')


const router = express.Router();
// http://localhost:3001/api/Order/CheckOut
router.post('/PayBillsQR',PayBillsControllers.postPayBills);


module.exports = router;

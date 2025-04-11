const CustomerBehaviorController = require('../controllers/CustomerBehaviorController');
const express = require('express')

const router = express.Router();
router.post('/',CustomerBehaviorController.addCustomerBehavior);
router.get('/NewCategory',CustomerBehaviorController.getNewCategory)
// router.post('/fetchVoucherByCusID',CustomerBehaviorController.getVoucherByCusID)
// router.get('/shop', CustomerBehaviorController.getVoucherShopByShopID)

module.exports = router
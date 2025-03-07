const CustomerShopFollowController = require('../controllers/CustomerShopFollowController');
const express = require('express')

const router = express.Router();
router.post('/AddCustomerShopFollow',CustomerShopFollowController.postAddCustomerShopFollow)
router.delete('/DeleteCustomerShopFollow', CustomerShopFollowController.deleteCustomerShopFollow)
router.get('/ListCustomerShopFollow', CustomerShopFollowController.getListCustomerShopFollow)
module.exports = router
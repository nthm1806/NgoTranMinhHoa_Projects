const VoucherController = require('../controllers/VoucherController');
const express = require('express')

const router = express.Router();
router.post('/getVoucherByCusID',VoucherController.getVoucherAllByCusID)
router.post('/getVoucherByShopID',VoucherController.getVoucherByShopID)
router.post('/fetchVoucherByCusID',VoucherController.getVoucherByCusID)
router.get('/shop', VoucherController.getVoucherShopByShopID)
router.get("/fetchAllVouchers", VoucherController.getAllVouchers)

module.exports = router
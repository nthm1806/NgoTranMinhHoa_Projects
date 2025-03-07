const VoucherDetailController = require('../controllers/VoucherDetailController');
const express = require('express')

const router = express.Router();
router.post('/SaveVoucherID',VoucherDetailController.postSaveVoucherID)
router.delete('/DeleteVoucherID', VoucherDetailController.deleteVoucherID)
router.get('/ListVoucherByCustomerID', VoucherDetailController.getListVoucherByCustomerID)
module.exports = router
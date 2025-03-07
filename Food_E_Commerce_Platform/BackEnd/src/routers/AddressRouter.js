const express = require('express');
const AddressController = require('../controllers/AddressController');

const router = express.Router();

router.get('/:customerID', AddressController.getAddressByCustomerId);
router.post('/', AddressController.addAddress);
router.put('/:addressID', AddressController.updateAddressById);
router.delete('/', AddressController.removeAddress);
router.post('/setDefault',AddressController.setDefault);

module.exports = router;

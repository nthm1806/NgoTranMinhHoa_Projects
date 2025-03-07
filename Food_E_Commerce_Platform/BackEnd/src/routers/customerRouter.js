const express = require('express');
const CustomerControllers = require('../controllers/CustomerController');
const upload = require('../middlewares/uploadConfig');

const router = express.Router();

router.get('/', CustomerControllers.getAllCustomers);
router.get('/:CustomerID', CustomerControllers.getCustomerById);
router.put('/:CustomerID', upload.single('Avatar'), (req, res, next) => {
    CustomerControllers.updateCustomerById(req, res, next);
});
module.exports = router;

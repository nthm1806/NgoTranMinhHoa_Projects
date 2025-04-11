const express = require('express');
const registerController = require('../controllers/RegisterController');

const router = express.Router();

router.post('/', registerController.addCustomer);



module.exports = router;
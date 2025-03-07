const comboProductController = require('../controllers/ComboProductController');
const express = require('express');

const router = express.Router();
router.post('/set-combo-product',comboProductController.setComboProduct);
router.post('/get-combo-product',comboProductController.getComboProduct);





module.exports = router;
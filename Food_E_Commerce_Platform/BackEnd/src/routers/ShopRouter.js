const shopController = require('../controllers/ShopController');
const express = require('express');

const router = express.Router();
router.get('/',shopController.getInforShop);
router.get('/getAll',shopController.getAllShop);




module.exports = router;
const ProductFavoriteController = require('../controllers/ProductFavoriteController');
const express = require('express')

const router = express.Router();
router.post('/AddProductIDTym',ProductFavoriteController.postAddProductIDTym);
router.delete('/DeleteProductIDTym',ProductFavoriteController.deleteProductIDTym);
router.get('/AllList',ProductFavoriteController.getAllProductFavorite);
module.exports = router;
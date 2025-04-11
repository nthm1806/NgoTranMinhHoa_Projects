const express = require('express');
const BlogCategoryController = require('../controllers/BlogCategoriesController');

const router = express.Router();

router.get('/', BlogCategoryController.getAllCategories);
router.get('/:id', BlogCategoryController.getCategoryByID);

module.exports = router;
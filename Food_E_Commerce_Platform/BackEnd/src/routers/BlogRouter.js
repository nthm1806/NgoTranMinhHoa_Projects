const express = require('express');
const BlogController = require('../controllers/BlogController');
const { uploadBlogImage } = require('../config/upload');

const router = express.Router();

router.get('/', BlogController.getAllBlogs);
router.get('/:blogID', BlogController.getBlogById);
router.get('/by-customer/:customerID', BlogController.getBlogByCustomer);
router.post('/', 
    uploadBlogImage.fields([
        { name: 'coverImage', maxCount: 1 }, 
        { name: 'images', maxCount: 20 }
    ]),
    BlogController.createBlog);
router.put('/:blogID', 
    uploadBlogImage.fields([
        { name: 'coverImage', maxCount: 1 }, 
        { name: 'images', maxCount: 20 }
    ]),
    BlogController.updateBlog);
router.delete('/:blogID', BlogController.deleteBlog);
router.post('/:blogID/like', BlogController.likeBlog);
router.get('/:blogID/isLiked', BlogController.checkLikedBlog);

module.exports = router;
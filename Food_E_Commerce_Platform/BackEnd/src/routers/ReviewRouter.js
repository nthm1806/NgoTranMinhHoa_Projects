const Review = require('../controllers/ReviewController');
const express = require('express');

const router = express.Router();

router.post('/addreview',Review.addReview)
router.post('/review',Review.addReview)
router.post('/review/detail',Review.getReview)


module.exports = router;
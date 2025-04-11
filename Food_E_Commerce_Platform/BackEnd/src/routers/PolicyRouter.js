const express = require('express');
const PolicyController = require('../controllers/PolicyController');

const router = express.Router();

router.post('/get-categories', PolicyController.getCategoryPolicy);
router.post('/search-policy', PolicyController.searchPolicy);

module.exports = router;
const express = require('express');
const ActivityLogsController = require('../controllers/ActivityLogsController');

const router = express.Router();

router.get('/:userID', ActivityLogsController.getLogsByUser);
router.post('/', ActivityLogsController.logActivity);

module.exports = router;
const notificationsControllers = require('../controllers/NotificationsControllers');
const express = require('express')

const router = express.Router();

router.get('/',notificationsControllers.getAllNotifications);
router.get('/status',notificationsControllers.getStatusNotifications);
router.post('/readAll', notificationsControllers.postReadAll);

module.exports = router;

const ShipperSS = require('../controllers/ShipperController');
const express = require('express')

const router = express.Router();

router.post('/getShipperByID',ShipperSS.getShipperByID)


module.exports = router;
const OrderControllers = require('../controllers/OrderController')
const express = require('express')


const router = express.Router();
// http://localhost:3001/api/Order/CheckOut
router.post('/',OrderControllers.getAllOrrders);
router.post('/OrdercusID',OrderControllers.getOrderByCusID);
router.post('/CheckOut',OrderControllers.addOrder);
router.post('/OrderDetailCusID',OrderControllers.getOrderDetailByCusID);
router.post('/prepay',OrderControllers.prepay);
router.post('/getOrderByOrderItem',OrderControllers.getOrderDetailByOrderID)

module.exports = router;

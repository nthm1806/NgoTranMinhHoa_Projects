const NotificationsServices = require("../services/NotificationsService");

const NotificationsControllers = {
  getAddNotifications: async (req, res) => {
    try {
      const OrderInfor = req.body.OrderInfor;
      const voucher = req.body.voucherChoose;   
      const totalPayment = req.body.totalPayment;
      const cusID = req.body.cusID;
      const result = await NotificationsServices.getAddNotifications(OrderInfor, voucher, totalPayment, cusID);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },

  getAllNotifications: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const typeNotification = req.query.typeNotification; 
      const result = await NotificationsServices.getAllNotifications(customerID, typeNotification);
      
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },

  getStatusNotifications: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const order_ID = req.query.order_ID;
      const voucher_ID = req.query.voucher_ID;
      const statusNotification = req.query.statusNotification;
      const result = await NotificationsServices.getStatusNotifications(customerID, order_ID, voucher_ID, statusNotification);
      
      res.status(200).json(result);
    } catch (err) {
      res.status(200).json("ok");
    }
  },
};
module.exports = NotificationsControllers;

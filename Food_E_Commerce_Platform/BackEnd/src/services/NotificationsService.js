const Notifications = require("../models/NotificationstModel");
const notificationsServices = {
  getAddNotifications: async (OrderInfor, voucher, totalPayment, cusID) => {
    const result = await Notifications.getAddNotifications(
      OrderInfor,
      voucher,
      totalPayment,
      cusID
    );
    return result;
  },

  getAllNotifications: async (customerID, typeNotification) => {
    try {
      const result = await Notifications.getAllNotifications(customerID, typeNotification);
      
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  getStatusNotifications : async (customerID, order_ID, voucher_ID, img, statusNotification) => {
    try {
      const result = await Notifications.getStatusNotifications(customerID, order_ID, voucher_ID, img, statusNotification);
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  postReadAll: async (notificationsList,typeNotification, customerID) => {
    try {
      const result = await Notifications.postReadAll(notificationsList,typeNotification, customerID);
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};
module.exports = notificationsServices;

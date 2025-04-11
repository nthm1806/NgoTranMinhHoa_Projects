const TransactionHistoryService = require("../services/TransactionHistoryService");

const TransactionHistory = {
  getTransactionHistory: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const typeTransactionHistory = req.query.typeTransactionHistory;
      const result = await TransactionHistoryService.getTransactionHistory(
        customerID,
        typeTransactionHistory
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },

  addBillPayment: async (req, res) => {
    const  inforFullUser  = JSON.parse(req.body.extraData)[0];
    const  item   = JSON.parse(req.body.extraData)[1];
    await TransactionHistoryService.addBillPayment(inforFullUser, item);
  },
};

module.exports = TransactionHistory;

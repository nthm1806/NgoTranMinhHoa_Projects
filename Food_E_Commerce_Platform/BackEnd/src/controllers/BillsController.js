const BillsService = require("../services/BillsService");

const Bills = {
  getBillsAll: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const typeBill = req.query.typeBill;
      const result = await BillsService.getBillsAll(
        customerID,
        typeBill
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = Bills;

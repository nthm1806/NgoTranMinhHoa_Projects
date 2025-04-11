const BillsModel = require('../models/BillsModel');

const Bills = {
    getBillsAll: async(customerID, typeBill)=>{
        const result = await BillsModel.getBillsAll(customerID, typeBill);
        return result
    },

}

module.exports = Bills;
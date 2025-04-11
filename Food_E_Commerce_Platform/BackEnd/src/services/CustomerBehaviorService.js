const CustomerBehaviorModel = require('../models/CustomerBehaviorModel');

const CustomerBehaviorService = {
    addCustomerBehavior: async(cusID, productID, category, type, shopID)=>{
        const result = await CustomerBehaviorModel.addCustomerBehavior(cusID, productID, category, type, shopID);
        return result
    },

    getNewCategory: async(customerID)=>{
        const result = await CustomerBehaviorModel.getNewCategory(customerID);
        return result
    },
}

module.exports = CustomerBehaviorService;
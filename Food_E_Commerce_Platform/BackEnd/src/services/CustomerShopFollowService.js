const CustomerShopFollowModel = require('../models/CustomerShopFollowModel');

const CustomerShopFollowService = {
    postAddCustomerShopFollow: async(customerID,shopID)=>{
        const result = await CustomerShopFollowModel.postAddCustomerShopFollow(customerID,shopID);
        return result
    },

    deleteCustomerShopFollow: async(customerID,shopID)=>{
        const result = await CustomerShopFollowModel.deleteCustomerShopFollow(customerID,shopID);
        return result
    },

    getListCustomerShopFollow: async(customerID)=>{
        const result = await CustomerShopFollowModel.getListCustomerShopFollow(customerID);
        return result
    },
}

module.exports = CustomerShopFollowService;


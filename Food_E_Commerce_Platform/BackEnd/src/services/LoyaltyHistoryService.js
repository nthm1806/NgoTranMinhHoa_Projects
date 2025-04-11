const LoyaltyHistoryModel = require("../models/LoyaltyHistoryModel");

const LoyaltyHistoryService = {
    getLoyaltyHistory: async (customerId) => {
        const orderHistory = await LoyaltyHistoryModel.getOrderHistoryByCustomerId(customerId);
        return { orderHistory };
    },

    getAllLoyaltyTiers: async () => {
        return await LoyaltyHistoryModel.getAllLoyaltyTiers();
    }
};

module.exports = LoyaltyHistoryService;

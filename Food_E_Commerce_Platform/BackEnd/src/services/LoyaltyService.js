const LoyaltyModel = require("../models/LoyaltyModel");

const determineLoyaltyTier = (totalOrders, totalSpent) => {
    if (totalOrders >= 10 && totalSpent >= 5000000) return "Diamond";
    if (totalOrders >= 6 && totalSpent >= 3000000) return "Gold";
    if (totalOrders >= 3 && totalSpent >= 1000000) return "Silver";
    return "Bronze";
};

const LoyaltyService = {
    getLoyaltyDetails: async (customerId) => {
        const customer = await LoyaltyModel.getCustomerById(customerId);
        if (!customer) throw new Error("Khách hàng không tồn tại");

        const { totalOrders, totalSpent } = await LoyaltyModel.getOrderStatsByCustomerId(customerId);
        const tierThresholds = await LoyaltyModel.getTierThresholds();

        // Hàm xác định tier hiện tại dựa trên data từ DB
        const determineTier = () => {
            const sortedTiers = tierThresholds.sort((a, b) => b.required_orders - a.required_orders);
            for (const tier of sortedTiers) {
                if (totalOrders >= tier.required_orders && totalSpent >= tier.required_spent) {
                    return tier.tier;
                }
            }
            return "Bronze";
        };

        const currentTier = determineTier();
        const rewards = await LoyaltyModel.getRewardsByTier(currentTier);

        return {
            name: `${customer.FirstName} ${customer.LastName}`,
            email: customer.Email,
            totalOrders,
            totalSpent,
            currentTier,
            rewards,
            tierThresholds // gửi về frontend
        };
    }

};


module.exports = LoyaltyService;

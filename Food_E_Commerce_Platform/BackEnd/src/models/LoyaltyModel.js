const pool = require("../config/Database");

const LoyaltyModel = {
    getCustomerById: async (customerId) => {
        const [rows] = await pool.query(
            `SELECT CustomerID, FirstName, LastName, Email 
             FROM Customer WHERE CustomerID = ?`,
            [customerId]
        );
        return rows[0] || null;
    },

    getOrderStatsByCustomerId: async (customerId) => {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS totalOrders, 
                    COALESCE(SUM(TotalAmount), 0) AS totalSpent 
             FROM Orders WHERE CustomerID = ?`,
            [customerId]
        );
        return rows[0] || { totalOrders: 0, totalSpent: 0 };
    },

    getRewardsByTier: async (tier) => {
        const [rows] = await pool.query(
            `SELECT reward_name, description, icon FROM LoyaltyRewards WHERE tier = ?`,
            [tier]
        );
        return rows;
    },
    getTierThresholds: async () => {
        const [rows] = await pool.query(`
            SELECT * FROM LoyaltyTierThresholds
            ORDER BY required_orders ASC
        `);
        return rows;
    },


};

module.exports = LoyaltyModel;

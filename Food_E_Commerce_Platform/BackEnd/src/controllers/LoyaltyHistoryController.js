const LoyaltyHistoryService = require("../services/LoyaltyHistoryService");

const LoyaltyHistoryController = {
    getLoyaltyHistory: async (req, res) => {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return res.status(400).json({ message: "customerId không hợp lệ!" });
            }


            const history = await LoyaltyHistoryService.getLoyaltyHistory(customerId);

            if (!history || history.orderHistory.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy lịch sử loyalty!" });
            }

            res.json(history);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllTiers: async (req, res) => {
        try {
            const tiers = await LoyaltyHistoryService.getAllLoyaltyTiers();
            res.json(tiers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = LoyaltyHistoryController;

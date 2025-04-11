const LoyaltyService = require("../services/LoyaltyService");

const LoyaltyController = {
    getLoyaltyByCustomerId: async (req, res) => {
        try {
            const { customerId } = req.params;
            const data = await LoyaltyService.getLoyaltyDetails(customerId);
            res.json(data);
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: error.message });
        }
    }
};

module.exports = LoyaltyController;

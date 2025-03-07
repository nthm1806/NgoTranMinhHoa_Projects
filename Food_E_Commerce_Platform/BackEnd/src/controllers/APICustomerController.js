const customerService = require('../services/APICustomerService');
exports.syncCustomerData = async (req, res) => {
    try {
        const result = await customerService.saveCustomer(req.body);
        res.status(200).json({ message: "Customer data synced successfully", result });
    } catch (error) {
        res.status(500).json({ message: "Error syncing customer data", error: error.message });
    }
};

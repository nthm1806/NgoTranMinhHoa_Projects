const db = require('../models/APICustomerModel');

exports.saveCustomer = async (data) => {
    try {
        await db.addCustomer(data);
    } catch (error) {
        console.error("Lỗi khi lưu khách hàng:", error.message);
        throw error;
    }
};

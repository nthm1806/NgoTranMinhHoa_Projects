const SupportModel = require('../models/SupportModel');


const SupportService = {
    createRequest: async (customer_id, category, subject, details) => {
        return await SupportModel.createRequest(customer_id, category, subject, details);
    },

    getUserRequests: async (customer_id) => {
        return await SupportModel.getUserRequests(customer_id);
    },

    // ✅ Hàm lấy chi tiết yêu cầu hỗ trợ theo ID
    getRequestById: async (id) => {
        return await SupportModel.getRequestById(id);
    },
    getRequestCategories: async () => {
        return await SupportModel.getRequestCategories();
    }
};

module.exports = SupportService;

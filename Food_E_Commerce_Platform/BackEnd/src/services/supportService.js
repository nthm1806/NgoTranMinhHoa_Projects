const SupportModel = require('../models/supportModel');

const SupportService = {
    createRequest: async (customer_id, category, subject, details) => {
        return await SupportModel.createRequest(customer_id, category, subject, details);
    },

    getUserRequests: async (customer_id) => {
        const requests = await SupportModel.getUserRequests(customer_id);
        const categories = await SupportModel.getRequestCategories();
        return requests.map(request => {
            const category = categories.find(cat => cat.id === request.category);
            return { ...request, category_name: category ? category.name : 'Không xác định' };
        });
    },

    getRequestById: async (id) => {
        return await SupportModel.getRequestById(id);
    },

    getRequestCategories: async () => {
        return await SupportModel.getRequestCategories();
    },

    updateRequest: async (id, subject, details) => {
        return await SupportModel.updateRequest(id, subject, details);
    },

    deleteRequest: async (id) => {
        return await SupportModel.deleteRequest(id);
    }
};

module.exports = SupportService;

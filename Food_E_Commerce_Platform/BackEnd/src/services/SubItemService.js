const SubItemModel = require("../models/SubItemModel");

const SubItemService = {
    getSubItemsByCategory: async (categoryId) => {
        return await SubItemModel.getSubItemsByCategory(categoryId);
    },

    searchSubItems: async (query) => {
        return await SubItemModel.searchSubItems(query);
    },

    // Hàm tăng view_count
    incrementViewCount: async (id) => {
        return await SubItemModel.incrementViewCount(id);
    }
};

module.exports = SubItemService;

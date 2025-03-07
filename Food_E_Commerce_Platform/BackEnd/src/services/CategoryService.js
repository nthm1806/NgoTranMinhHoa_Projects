const CategoryModel = require("../models/CategoryModel");

const CategoryService = {
    getAllCategories: async () => {
        return await CategoryModel.getAllCategories();
    },

    getCategoryById: async (id) => {
        return await CategoryModel.getCategoryById(id);
    },

    createCategory: async (name, link, image) => {
        return await CategoryModel.createCategory(name, link, image);
    },

    updateCategory: async (id, name, link, image) => {
        return await CategoryModel.updateCategory(id, name, link, image);
    },

    deleteCategory: async (id) => {
        return await CategoryModel.deleteCategory(id);
    }
};

module.exports = CategoryService;
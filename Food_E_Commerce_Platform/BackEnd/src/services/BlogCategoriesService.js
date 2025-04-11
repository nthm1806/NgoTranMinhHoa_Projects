const BlogCategoriesModel = require("../models/BlogCategoriesModel");

const Blog = {
    getBlogCategories: async () => {
        return await BlogCategoriesModel.getBlogCategories();
    },

    getBlogCategoryById: async (categoryID) => {
        return await BlogCategoriesModel.getBlogCategoryById(categoryID);
    }
}

module.exports = Blog
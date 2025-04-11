const BlogCategoryService = require("../services/BlogCategoriesService");

const Blog = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await BlogCategoryService.getBlogCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    },

    getCategoryByID: async (req, res) => {
        try {
            const categoryID = req.params.id;
            const category = await BlogCategoryService.getBlogCategoryByID(categoryID);
            if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = Blog
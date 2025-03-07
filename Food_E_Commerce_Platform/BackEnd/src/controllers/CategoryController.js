const CategoryService = require("../services/CategoryService");

const CategoryController = {
    getAllCategories: async (req, res, next) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },

    getCategoryById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryById(id);
            if (!category) return res.status(404).json({ error: "Category not found" });
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    },

    createCategory: async (req, res, next) => {
        try {
            const { name, link, image } = req.body;
            if (!name || !link || !image) return res.status(400).json({ error: "Missing fields" });
            const newCategory = await CategoryService.createCategory(name, link, image);
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, link, image } = req.body;
            const updatedCategory = await CategoryService.updateCategory(id, name, link, image);
            if (!updatedCategory) return res.status(404).json({ error: "Category not found" });
            res.status(200).json(updatedCategory);
        } catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = await CategoryService.deleteCategory(id);
            if (!deleted) return res.status(404).json({ error: "Category not found" });
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CategoryController;

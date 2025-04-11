const SubItemService = require("../services/SubItemService");

const SubItemController = {
    getSubItemsByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            if (!categoryId) {
                return res.status(400).json({ error: "Missing categoryId" });
            }
            const subItems = await SubItemService.getSubItemsByCategory(categoryId);
            res.status(200).json(subItems);
        } catch (error) {
            console.error("Error fetching sub-items:", error.message);
            res.status(500).json({ error: "Server error", details: error.message });
        }
    },

    searchSubItems: async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ error: "Missing search query" });
            }
            const subItems = await SubItemService.searchSubItems(q);
            res.status(200).json(subItems);
        } catch (error) {
            console.error("Error searching sub-items:", error.message);
            res.status(500).json({ error: "Server error", details: error.message });
        }
    },

    incrementSubItemViewCount: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await SubItemService.incrementViewCount(id);

            if (!updated) {
                return res.status(404).json({ error: "SubItem không tồn tại" });
            }
            res.status(200).json({ message: "View count updated" });
        } catch (error) {
            console.error("Error updating view count:", error.message);
            res.status(500).json({ error: "Lỗi server" });
        }
    }
};

module.exports = SubItemController;

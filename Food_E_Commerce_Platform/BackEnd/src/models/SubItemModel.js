const pool = require("../config/Database");

const SubItemModel = {
    getSubItemsByCategory: async (categoryId) => {
        const [result] = await pool.query("SELECT * FROM SubItemPortal WHERE category_id = ?", [categoryId]);
        return result;
    },

    searchSubItems: async (query) => {
        const [result] = await pool.query(
            "SELECT * FROM SubItemPortal WHERE title LIKE ? OR details LIKE ?",
            [`%${query}%`, `%${query}%`]
        );
        return result;
    },

    // Hàm cập nhật view_count
    incrementViewCount: async (id) => {
        const [result] = await pool.query(
            "UPDATE SubItemPortal SET view_count = view_count + 1 WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = SubItemModel;

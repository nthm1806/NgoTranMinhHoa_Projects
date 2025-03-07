const pool = require("../config/Database");

const CategoryModel = {
    getAllCategories: async () => {
        const [rows] = await pool.query("SELECT * FROM CategoryPortal");
        return rows;
    },

    getCategoryById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM CategoryPortal WHERE id = ?", [id]);
        return rows[0];
    },

    createCategory: async (name, link, image) => {
        const [result] = await pool.query(
            "INSERT INTO CategoryPortal (name, link, image) VALUES (?, ?, ?)",
            [name, link, image]
        );
        return { id: result.insertId, name, link, image };
    },

    updateCategory: async (id, name, link, image) => {
        const [result] = await pool.query(
            "UPDATE CategoryPortal SET name = ?, link = ?, image = ? WHERE id = ?",
            [name, link, image, id]
        );
        return result.affectedRows > 0 ? { id, name, link, image } : null;
    },

    deleteCategory: async (id) => {
        const [result] = await pool.query("DELETE FROM CategoryPortal WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
};

module.exports = CategoryModel;
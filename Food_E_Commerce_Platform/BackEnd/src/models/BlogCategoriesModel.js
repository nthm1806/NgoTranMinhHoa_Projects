const pool = require('../config/Database');

const BlogCategories = {
    getBlogCategories: async () => {
        const [result] = await pool.query('SELECT * FROM BlogCategories');
        return result;
    },

    getCategoryByID: async (categoryID) => {
        const result = await pool.query('SELECT * FROM BlogCategories WHERE ID = ?', [categoryID]);
        return result[0][0] || null;
    },
}

module.exports = BlogCategories
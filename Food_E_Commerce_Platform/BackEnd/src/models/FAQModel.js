const pool = require("../config/Database");

const FAQModel = {
    getPopularFAQs: async () => {
        const [rows] = await pool.query(`
            SELECT id, category_id, title AS question, details AS answer 
            FROM SubItemPortal 
            ORDER BY view_count DESC 
            LIMIT 10

        `);
        return rows;
    },

    incrementViewCount: async (id) => {
        const [result] = await pool.query(
            "UPDATE SubItemPortal SET view_count = view_count + 1 WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = FAQModel;

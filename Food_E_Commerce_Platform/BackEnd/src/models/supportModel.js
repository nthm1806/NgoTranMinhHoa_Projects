const pool = require('../config/Database');

const SupportModel = {
    createRequest: async (customer_id, category_id, subject, details) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO SupportRequests (customer_id, category, subject, details) VALUES (?, ?, ?, ?)',
                [customer_id, category_id, subject, details]
            );
            return { id: result.insertId, customer_id, category_id, subject, details, status: 'pending' };
        } catch (error) {
            console.error("❌ Lỗi khi tạo yêu cầu hỗ trợ:", error);
            throw new Error("Lỗi khi tạo yêu cầu hỗ trợ.");
        }
    },

    getUserRequests: async (customer_id) => {
        try {
            const [rows] = await pool.query(
                `SELECT sr.*, rc.name AS category_name 
                 FROM SupportRequests sr 
                 JOIN RequestCategories rc ON sr.category = rc.id 
                 WHERE sr.customer_id = ? ORDER BY sr.created_at DESC`,
                [customer_id]
            );
            return rows;
        } catch (error) {
            console.error("❌ Lỗi khi lấy lịch sử yêu cầu:", error);
            throw new Error("Lỗi khi lấy lịch sử yêu cầu.");
        }
    },

    // Thêm truy vấn lấy yêu cầu theo ID
    getRequestById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM SupportRequests WHERE id = ?',
            [id]
        );
        return rows.length ? rows[0] : null;
    },
    getRequestCategories: async () => {
        const [rows] = await pool.query("SELECT id, name FROM RequestCategories");
        return rows;
    }
};

module.exports = SupportModel;

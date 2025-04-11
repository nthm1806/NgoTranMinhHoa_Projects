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
                'SELECT * FROM SupportRequests WHERE customer_id = ? ORDER BY created_at DESC',
                [customer_id]
            );
            return rows;
        } catch (error) {
            console.error("❌ Lỗi khi lấy lịch sử yêu cầu:", error);
            throw new Error("Lỗi khi lấy lịch sử yêu cầu.");
        }
    },

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
    },

    updateRequest: async (id, subject, details) => {
        try {
            const [result] = await pool.query(
                "UPDATE SupportRequests SET subject = ?, details = ? WHERE id = ? AND status = 'pending'",
                [subject, details, id]
            );

            if (result.affectedRows === 0) {
                throw new Error("Không thể cập nhật yêu cầu. Chỉ có thể cập nhật khi trạng thái là 'Đang chờ xử lý'.");
            }

            return { success: true };
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật yêu cầu:", error);
            throw new Error("Lỗi khi cập nhật yêu cầu.");
        }
    },

    deleteRequest: async (id) => {
        try {
            const [result] = await pool.query(
                "DELETE FROM SupportRequests WHERE id = ? AND status = 'pending'",
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error("Không thể xóa yêu cầu. Chỉ có thể xóa khi trạng thái là 'Đang chờ xử lý'.");
            }

            return { success: true };
        } catch (error) {
            console.error("❌ Lỗi khi xóa yêu cầu:", error);
            throw new Error("Lỗi khi xóa yêu cầu.");
        }
    }
};

module.exports = SupportModel;

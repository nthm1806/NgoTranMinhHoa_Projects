const AffiliateTrackingService = require("../services/AffiliateTrackingService");

const AffiliateTrackingController = {
    getAffiliateStatsByCustomer: async (req, res) => {
        try {
            const { customerId } = req.params;
            const stats = await AffiliateTrackingService.getAffiliateStats(customerId);

            if (!stats.length) {
                return res.status(404).json({ message: "Không có dữ liệu tiếp thị." });
            }

            res.json(stats);
        } catch (error) {
            console.error("❌ Lỗi lấy dữ liệu tiếp thị:", error);
            res.status(500).json({ message: "Lỗi máy chủ." });
        }
    },

    getAffiliateHistoryByCustomer: async (req, res) => {
        try {
            const { customerId } = req.params;
            const history = await AffiliateTrackingService.getAffiliateHistory(customerId);

            if (!history.length) {
                return res.status(404).json({ message: "Không có lịch sử tiếp thị." });
            }

            res.json(history);
        } catch (error) {
            console.error("❌ Lỗi lấy lịch sử tiếp thị:", error);
            res.status(500).json({ message: "Lỗi máy chủ." });
        }
    },

    trackAffiliateClick: async (req, res) => {
        try {
            const { customCode, customerId } = req.body;

            if (!customCode || !customerId) {
                return res.status(400).json({ message: "Thiếu mã tiếp thị hoặc CustomerID." });
            }

            const result = await AffiliateTrackingService.trackAffiliateClick(customCode, customerId);
            res.json({ message: `Bạn đã giúp ${result.referrerName} nhận ${result.amount} xu!` });
        } catch (error) {
            console.error("❌ Lỗi nhập mã tiếp thị:", error.message);
            res.status(400).json({ message: error.message });
        }
    },

    // Kiểm tra mã này khách hàng đã dùng chưa
    checkCodeAlreadyUsedByCustomer: async (customerId, customCode) => {
        const [rows] = await pool.query(
            `SELECT * FROM AffiliateCodeUsage WHERE customerId = ? AND customCode = ?`,
            [customerId, customCode]
        );
        return rows.length > 0;
    },

    // Kiểm tra mã thuộc về khách hàng (để tránh nhập mã của chính mình)
    isOwnAffiliateCode: async (customerId, customCode) => {
        const [rows] = await pool.query(
            `SELECT * FROM AffiliateTracking WHERE CustomCode = ? AND ReferrerID = ?`,
            [customCode, customerId]
        );
        return rows.length > 0;
    },

    // Lưu lịch sử sử dụng mã
    saveCodeUsage: async (customerId, customCode) => {
        await pool.query(
            `INSERT INTO AffiliateCodeUsage (customerId, customCode) VALUES (?, ?)`,
            [customerId, customCode]
        );
    },

};

module.exports = AffiliateTrackingController;

const pool = require("../config/Database");

const AffiliateTrackingModel = {
    // Lấy thống kê tiếp thị theo CustomerID từ AffiliateTracking
    getAffiliateTrackingByCustomer: async (customerId) => {
        const [rows] = await pool.query(
            `SELECT CustomCode, Clicks FROM AffiliateTracking WHERE ReferrerID = ?`,
            [customerId]
        );
        return rows;
    },

    // Lấy xu từ Customer
    getCustomerXuById: async (customerId) => {
        const [rows] = await pool.query(
            `SELECT xu FROM Customer WHERE CustomerID = ?`,
            [customerId]
        );
        return rows.length ? rows[0].xu : 0;
    },

    // Lấy lịch sử tiếp thị từ AffiliateHistory
    getAffiliateHistoryByReferrerId: async (referrerId) => {
        const [rows] = await pool.query(
            `SELECT ReferredUserID, CustomCode, CreatedAt FROM AffiliateHistory WHERE CustomCode IN (
                SELECT CustomCode FROM AffiliateTracking WHERE ReferrerID = ?
            ) ORDER BY CreatedAt DESC`,
            [referrerId]
        );
        return rows;
    },

    // Lấy thông tin khách hàng theo ID
    getCustomerById: async (customerId) => {
        const [rows] = await pool.query(
            `SELECT FirstName, LastName FROM Customer WHERE CustomerID = ?`,
            [customerId]
        );
        return rows.length ? rows[0] : null;
    },

    // Kiểm tra CustomCode tồn tại
    getAffiliateTrackingByCode: async (customCode) => {
        const [rows] = await pool.query(
            `SELECT ReferrerID FROM AffiliateTracking WHERE CustomCode = ?`,
            [customCode]
        );
        return rows.length ? rows[0] : null;
    },

    // Tăng số lượt click của mã giới thiệu
    increaseClickCount: async (customCode) => {
        await pool.query(
            `UPDATE AffiliateTracking SET Clicks = Clicks + 1 WHERE CustomCode = ?`,
            [customCode]
        );
    },

    // Cộng xu vào tài khoản Customer
    addXuToCustomer: async (customerId, xu) => {
        await pool.query(
            `UPDATE Customer SET xu = xu + ? WHERE CustomerID = ?`,
            [xu, customerId]
        );
    },

    // Thêm lịch sử affiliate
    addAffiliateHistory: async (referredUserId, customCode) => {
        await pool.query(
            `INSERT INTO AffiliateHistory (ReferredUserID, CustomCode) VALUES (?, ?)`,
            [referredUserId, customCode]
        );
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

module.exports = AffiliateTrackingModel;

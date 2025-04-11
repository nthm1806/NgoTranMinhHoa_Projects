const AffiliateTrackingModel = require("../models/AffiliateTrackingModel");

const AffiliateTrackingService = {
    // Lấy thống kê tiếp thị (CustomCode, Clicks, xu)
    getAffiliateStats: async (customerId) => {
        const trackingData = await AffiliateTrackingModel.getAffiliateTrackingByCustomer(customerId);
        const xu = await AffiliateTrackingModel.getCustomerXuById(customerId);

        return trackingData.map(data => ({
            CustomCode: data.CustomCode,
            Clicks: data.Clicks,
            xu
        }));
    },

    // Lấy lịch sử tiếp thị đầy đủ thông tin khách hàng
    getAffiliateHistory: async (customerId) => {
        const historyData = await AffiliateTrackingModel.getAffiliateHistoryByReferrerId(customerId);

        // Lấy tên khách hàng được giới thiệu (map async)
        const historyWithNames = await Promise.all(
            historyData.map(async item => {
                const customer = await AffiliateTrackingModel.getCustomerById(item.ReferredUserID);
                return {
                    FirstName: customer?.FirstName || 'Unknown',
                    LastName: customer?.LastName || '',
                    CustomCode: item.CustomCode,
                    CreatedAt: item.CreatedAt
                };
            })
        );

        return historyWithNames;
    },

    // Xử lý nhập mã tiếp thị
    trackAffiliateClick: async (customCode, referredUserId) => {
        // Check mã tồn tại
        const tracking = await AffiliateTrackingModel.getAffiliateTrackingByCode(customCode);
        if (!tracking) {
            throw new Error("Mã tiếp thị không tồn tại.");
        }

        const referrerId = tracking.ReferrerID;

        // Kiểm tra không cho phép dùng mã của chính mình
        const isOwnCode = await AffiliateTrackingModel.isOwnAffiliateCode(referredUserId, customCode);
        if (isOwnCode) {
            throw new Error("Bạn không thể nhập mã tiếp thị của chính mình.");
        }

        // Kiểm tra mã đã nhập trước đây chưa
        const alreadyUsed = await AffiliateTrackingModel.checkCodeAlreadyUsedByCustomer(referredUserId, customCode);
        if (alreadyUsed) {
            throw new Error("Bạn đã nhập mã này trước đó rồi.");
        }

        // Xử lý cộng xu và tăng lượt click
        await AffiliateTrackingModel.increaseClickCount(customCode);
        const rewardAmount = 100; // có thể điều chỉnh linh động nếu cần
        await AffiliateTrackingModel.addXuToCustomer(referrerId, rewardAmount);
        await AffiliateTrackingModel.addAffiliateHistory(referredUserId, customCode);

        // Lưu lịch sử nhập mã
        await AffiliateTrackingModel.saveCodeUsage(referredUserId, customCode);

        const referrer = await AffiliateTrackingModel.getCustomerById(referrerId);
        const referrerName = referrer ? `${referrer.FirstName} ${referrer.LastName}` : "Unknown";

        return { referrerName, amount: rewardAmount };
    },

};

module.exports = AffiliateTrackingService;

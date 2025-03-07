const ActivityLogsService = require('../services/ActivityLogsService');

const ActivityLogsController = {
    logActivity: async (req, res) => {
        try {
            const { userID, action, details } = req.body;
            if (!userID || action) {
                return res.status(400).json({ message: 'Thiếu dữ liệu' });
            }
            await ActivityLogsService.logActivity(userID, action, details);
            res.status(200).json({ message: 'Ghi nhật ký thành công' });
        } catch (err) {
            console.error("Lỗi ghi nhật ký", err);
            res.status(500).json({ message: 'Lỗi server', err });
        }
    },

    getLogsByUser: async (req, res) => {
        const { userID } = req.params;
        if (!userID) {
            return res.status(400).json({ message: 'Thiếu userID' });
        }
        try {
            const logs = await ActivityLogsService.getLogsByUser(userID);
            res.status(200).json(logs);
        } catch (err) {
            console.error("Lỗi lấy nhật ký: ", err);
            res.status(500).json({ message: 'Lỗi server', err });
        }
    }
};

module.exports = ActivityLogsController;
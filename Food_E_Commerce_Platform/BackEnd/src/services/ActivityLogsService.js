const ActivityLogsModel = require("../models/ActivityLogsModel");

const ActivityLogsService = {
    logActivity: async (userID, action, details) => {
        await ActivityLogsModel.logActivity(userID, action, details);
    },

    getLogsByUser: async (userID) => {
        return await ActivityLogsModel.getLogsByUser(userID);
    }
};

module.exports = ActivityLogsService;
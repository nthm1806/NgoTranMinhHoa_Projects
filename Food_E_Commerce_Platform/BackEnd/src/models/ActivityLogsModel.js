const pool = require("../config/Database");

const ActivityLogs = {
    logActivity: async (userID, action, details) => {
        const query = "INSERT INTO activity_logs (user_id, action, details, timestamp) VALUES (?, ?, ?, ?)";
        await pool.query(query, [userID, action, JSON.stringify(details)]);
    },

    getLogsByUser: async (userID) => {
        const query = "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC";
        const result = await pool.query(query, [userID]);
        return result[0];
    }

}

module.exports = ActivityLogs
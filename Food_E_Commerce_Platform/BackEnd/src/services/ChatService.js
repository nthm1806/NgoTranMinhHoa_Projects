const chatModel = require("../models/chat");

const ActivityLogsService = {
    getQuestion: async (body) => {
        return await chatModel.getQuestion(body);
    },

    getChat: async (body) => {
        return await chatModel.getChat(body);
    },
    setChat: async (body) => {
        return await chatModel.setChat(body);
    }
};

module.exports = ActivityLogsService;
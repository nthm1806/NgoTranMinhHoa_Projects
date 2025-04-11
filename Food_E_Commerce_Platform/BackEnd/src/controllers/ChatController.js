const chatService = require('../services/ChatService');

const ActivityLogsController = {
    getChat: async (req, res) => {
        try {
           const rs = await chatService.getChat(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
            console.log(err);

        }
    },

    getQuestion: async (req, res) => {
        try {
            const rs = await chatService.getQuestion(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
            console.log(err);
        }
    },

    setChat: async (req, res) => {
        try {
            const rs = await chatService.setChat(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
            console.log(err);

        }
    }
};

module.exports = ActivityLogsController;
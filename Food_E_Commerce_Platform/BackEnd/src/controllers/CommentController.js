const CommentService = require("../services/CommentService");

const Comment = {
    getCommentsByBlogID: async (req, res) => {
        try {
            const { blogID } = req.params;
            const comments = await CommentService.getCommentsByBlogID(blogID);
            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }
    },

    addComment: async (req, res) => {
        const { blogID, customerID, content } = req.body;
        try {
            const comment = await CommentService.addComment({ blogID, customerID, content });
            res.status(200).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }    
    },

    updateComment: async (req, res) => {
        const { commentID } = req.params;
        const { content } = req.body;
        try {
            await CommentService.updateComment(commentID, content);
            res.status(200).json({ message: "Cập nhật thành công!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }    
    },

    deleteComment: async (req, res) => {
        const { commentID } = req.params;
        try {
            await CommentService.deleteComment(commentID);
            res.status(200).json({ message: "Xóa thành công!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }    
    }
};

module.exports = Comment;
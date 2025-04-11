const CommentModel = require("../models/CommentModel");

const Comment = {
    getCommentsByBlogID: async (blogID) => {
        return await CommentModel.getCommentsByBlogID(blogID);
    },
    
    addComment: async ({ blogID, customerID, content }) => {
        return await CommentModel.addComment(blogID, customerID, content);
    },

    updateComment: async (commentID, content) => {
        return await CommentModel.updateComment(commentID, content);
    },

    deleteComment: async (commentID) => {
        return await CommentModel.deleteComment(commentID);
    },
};

module.exports = Comment;
const pool = require("../config/Database");

const Comment = {
    getCommentsByBlogID: async (blogID) => {
        const [rows] = await pool.query(
            `SELECT c.ID as CommentID, c.Content, c.CustomerID, c.CreatedAt, cus.FirstName, cus.LastName
            FROM Comments c
            JOIN Customer cus ON c.CustomerID = cus.CustomerID
            WHERE c.BlogID = ? ORDER BY c.CreatedAt DESC`,
            [blogID]
        );
        return rows.map((row) => ({
            commentID: row.CommentID,
            customerID: row.CustomerID,
            createdAt: row.CreatedAt,
            content: row.Content,
            firstName: row.FirstName,
            lastName: row.LastName,
        }));
    },

    addComment: async (blogID, customerID, content) => {
        const [rows] = await pool.query(`
            INSERT INTO Comments (BlogID, CustomerID, Content)
            VALUES (?, ?, ?)`,
            [blogID, customerID, content]
        );
    },

    updateComment: async (commentID, content) => {
        await pool.query(
            `UPDATE Comments SET Content = ?, UpdatedAt = NOW() WHERE ID = ?`,
        [content, commentID]
        );
    },

    deleteComment: async (commentID) => {
        await pool.query(`DELETE FROM Comments WHERE ID = ?`, [commentID]);
    }
};

module.exports = Comment;
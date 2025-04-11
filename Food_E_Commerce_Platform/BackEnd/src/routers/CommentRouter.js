const express = require('express');
const CommentController = require('../controllers/CommentController');

const router = express.Router();

router.get('/blog/:blogID', CommentController.getCommentsByBlogID);
router.post('/', CommentController.addComment);
router.put('/:commentID', CommentController.updateComment);
router.delete('/:commentID', CommentController.deleteComment);

module.exports = router;
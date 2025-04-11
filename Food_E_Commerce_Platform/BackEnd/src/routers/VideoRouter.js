const express = require('express');
const VideoRouter = express.Router();
const VideoController = require('../controllers/VideoController');
const { upload } = require("../config/upload");

VideoRouter.post('/getVideoByID', VideoController.getVideoByID);
VideoRouter.post('/getVideo', VideoController.getVideo);

VideoRouter.post('/likeVideo', VideoController.likeVideo);
VideoRouter.post('/report', upload.single("file"),VideoController.report);
VideoRouter.post('/getCommentByVideoID',VideoController.getCommentByVideoID);
VideoRouter.post('/likeComment',VideoController.likeComment);
VideoRouter.post('/addComment',VideoController.addComment);

module.exports = VideoRouter;

const VideoService = require('../services/VideoService');
const Video ={
    getCommentByVideoID: async(req,res)=>{
        try {
            const {videoID,cusID} = req.body;
            const result = await VideoService.getCommentByVideoID(videoID,cusID);
            res.json(result);
        } catch (error) {
            console.log(error)
        }
        
    },
    addComment: async (req,res)=>{
        try {
            const {videoID,content,parentCom,cusID} = req.body;
            const result = await VideoService.addComment(videoID,content,parentCom,cusID);
            res.json(result)
        } catch (error) {
            console.log(error)
        }

    },
    likeComment:async (req,res)=>{
        try {
            const {commentID,addLike, addDisLike,cusID} = req.body;
            await VideoService.likeComment(commentID,addLike, addDisLike,cusID)
        } catch (error) {
            console.log(error)
        }
        
    },
    getVideo: async (req, res) => {
        try {
            const video = await VideoService.getVideo();
            res.json(video);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Lỗi lấy video!" });
        }
    },
    getVideoByID: async (req, res) => {
        try {
            const { videoID,cusID } = req.body;
            const video = await VideoService.getVideoByID(videoID,cusID);
            res.json(video);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Lỗi lấy video!" });
        }
    },
    likeVideo: async (req, res) => {
        try {
            const { cusID,videoID, addLike, addDisLike } = req.body;
            await VideoService.likeVideo(videoID, addLike, addDisLike,cusID);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Lỗi like video!" });
        }
    },
    report: async(req,res)=>{
        try {
            const file  = req.file.path;
            const {videoID,selectedValue,textReport} = req.body;
            await VideoService.addReport(videoID,selectedValue,file,textReport);
            res.status(200)
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = Video;
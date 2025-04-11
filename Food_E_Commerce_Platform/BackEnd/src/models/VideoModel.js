const pool = require('../config/Database');

const video = {
    getVideoByID: async (videoID,cusID) => {
        const [rows] = await pool.execute('SELECT * FROM Video WHERE VideoID = ?', [videoID]);
        const [rows1] = await pool.execute('SELECT Types FROM LikeVideo WHERE VideoID = ? and CustomerID = ?', [videoID,cusID]);
        const result = rows.map(video => ({
            ...video,           
            LikeDis: `${rows1.length > 0 ? rows1[0].Types : ""}`
        }));
        return result;
    },
    getVideo: async () => {
        const [rows] = await pool.execute('SELECT * FROM Video LIMIT 4', );
        return rows;
    },
    getVideoList: async (category,videoID,cusID) => {
        const [rows] = await pool.execute('SELECT * FROM Video where Category = ? and VideoID != ?', [category, videoID]);
        const result = Promise.all(rows.map(async video => {
            const [rows1] = await pool.execute('SELECT Types FROM LikeVideo WHERE VideoID = ? and CustomerID = ?', [video.VideoID,cusID]);
            return {
                ...video,
                LikeDis: `${rows1.length > 0 ? rows1[0].Types : ""}`
            }
        }));
        return result;
    },
    likeVideo: async (videoID, addLike, addDisLike,cusID) => {
        await pool.execute('UPDATE Video SET TotalLike = TotalLike + ?, TotalDisLike = TotalDisLike + ? WHERE VideoID = ?', [addLike, addDisLike, videoID]);
        if(addLike == -1){
            await pool.execute('delete from LikeVideo where VideoID = ? and CustomerID = ?', [videoID,cusID]);
        }
        if(addDisLike == -1){
            await pool.execute('delete from LikeVideo where VideoID = ? and CustomerID = ?', [videoID,cusID]);
        }
        if(addLike ==1){
            await pool.execute('insert into LikeVideo  values(?,? ,"like")', [videoID,cusID]);
        }
        if(addDisLike ==1){
            await pool.execute('insert into LikeVideo values(?,? ,"dislike")', [videoID,cusID]);
        }
        
    },
    likeComment: async (CommentID, addLike, addDisLike,cusID) => {
        await pool.execute('UPDATE CommentVideo SET TotalLike = TotalLike + ?, TotalDisLike = TotalDisLike + ? WHERE CommentID = ?', [addLike, addDisLike, CommentID]);
        if(addLike == -1){
            await pool.execute('delete from LikeComment where CommentID = ? and CustomerID = ?', [CommentID,cusID]);
        }
        if(addDisLike == -1){
            await pool.execute('delete from LikeComment where CommentID = ? and CustomerID = ?', [CommentID,cusID]);
        }
        if(addLike ==1){
            await pool.execute('insert into LikeComment values(?,? ,"like")', [cusID,CommentID]);
        }
        if(addDisLike ==1){
            await pool.execute('insert into LikeComment values(?,? ,"dislike")', [cusID,CommentID]);
        }
        
    },
    addReport: async (videoID,selectedValue,file,textReport)=>{
        await pool.query('insert into ReportVideo (VideoID,Content,Img,Types) values (? ,?,? , ?)',[videoID,textReport,file,selectedValue])
    },
    getCommentByVideoID:async(videoID)=>{
        const comment = await pool.query('select * from CommentVideo where VideoID = ?', [videoID]);
        return comment[0];
    },
    getLikeDis:async(CommentID,cusID)=>{
        const result = await pool.query('SELECT Types FROM LikeComment WHERE CommentID = ? and CustomerID = ?', [CommentID,cusID]);
        return result
    },
    addComment: async (videoID,content,parentCom,cusID)=>{
        let result;
        if(parentCom){
            result = await pool.query('insert into CommentVideo values(null,?,?,0,0,?,?)',[videoID,content,parentCom,cusID]);
        }else{
            result = await pool.query('insert into CommentVideo values(null,?,?,0,0,null,?)',[videoID,content,cusID]);
        }
        return result[0].insertId;
    }
}   

module.exports = video;
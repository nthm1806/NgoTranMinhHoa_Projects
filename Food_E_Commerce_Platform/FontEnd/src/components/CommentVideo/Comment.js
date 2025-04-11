import React, { useEffect, useState } from "react";
import styles from "./Comment.module.css";
import axios from "axios";

const Comment = ({ comment,setLikeDis ,handleReply}) => {
    const cusID = JSON.parse(localStorage.getItem("user")).id;
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reply,setReply] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isLong = comment.comment.Content.length > 50;
  const shortText = comment.comment.Content.slice(0, 50) + "...";

  useEffect(()=>{
    
    if(comment.LikeDis == 'dislike'){
        setDislike(true);

    }else if(comment.LikeDis == 'like'){
        setLike(true)
    }
  },[comment])

  async function handleAply(){
    if(reply){
        setReplyText('')
    }
    setReply(!reply);
  }
  const handleLike = async() => {
    let addLike = -1;
    let addDisLike =0;
    if(!like){
        addLike = 1;
        if(dislike){
            addDisLike = -1;
        }
    }
    setLikeDis(comment.comment.CommentID,addLike, addDisLike);
    setLike(!like);
    setDislike(false);
    await axios.post('http://localhost:3001/api/video/likeComment', {commentID: comment.comment.CommentID, addLike, addDisLike,cusID});
  };
  const handleDislike = async() => {
    let addLike = 0;
    let addDisLike =-1;
    if(!dislike){
        addDisLike = 1;
        if(like){
            addLike = -1;
        }
    }
    setLikeDis(comment.comment.CommentID,addLike, addDisLike);
    setDislike(!dislike);
    setLike(false);
    await axios.post('http://localhost:3001/api/video/likeComment', {commentID: comment.comment.CommentID, addLike, addDisLike,cusID});
    
  };
  async function handle(){
    if (handleReply) {
      console.log('jcjcjc')
      handleReply(comment.comment.CommentID, replyText);
    } else {
      console.error("handleReply is not defined");
    }
    setReply(false);
    setReplyText('');
  }
  return (
    <div className={styles.comment}>
      <img src={comment.avatar} alt={comment.cusName} className={styles.avatar} />
      <div className={styles.commentInner}>
        <div className={styles.commentContent}>
            <strong>{comment.cusName}</strong>
            <span>
                {expanded || !isLong ? comment.comment.Content : shortText}
            </span>
            {isLong && (
                <span onClick={() => setExpanded(!expanded)} className={styles.readMore}>
                {expanded ? "  Ẩn bớt" : "Xem thêm"}
                </span>
          )}
        </div>
        <div className={styles.commentActions}>
            <p onClick ={()=> handleLike()} className={`${like ? styles.choose : ''}`}>{comment.comment.TotalLike > 0 ? comment.comment.TotalLike : ''} Thích</p>
            <p onClick ={()=> handleDislike()} className={`${dislike ? styles.choose : ''}`}>{comment.comment.TotalDislike > 0 ? comment.comment.TotalDislike : ''} Không thích</p>
        </div>
        <div className={styles.commentActions}>
          {comment.children.length >0 ? (
            <button onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? "Thu gọn" : "Xem thêm"}
          </button>
          ):''}
          <button onClick={()=>handleAply()}> {reply ? 'Ẩn trả lời' : 'Trả lời'}</button>
        </div>
        {reply ? (
            <div className={styles.aply}>
            <textarea value={replyText} onChange={(e)=> setReplyText(e.target.value)} placeholder="Cảm nghĩ của bạn..."   />
            <button onClick = {()=>{handle()}}>Gửi</button>
            </div>
        ):''}
        {showReplies &&
          comment.children.map((child) => (
            <Comment key={child.comment.CommentID} comment={child} handleReply={handleReply} setLikeDis={setLikeDis}/>
          ))}
      </div>
    </div>
  );
};
export default Comment
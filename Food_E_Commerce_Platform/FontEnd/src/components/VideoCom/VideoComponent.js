import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import styles from "./VideoComponent.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../CommentVideo/Comment";
import axios from "axios";

function VideoComponent({
  setVideoID,
  currentVideo,
  currentVideoIndex,
  handleNextVideo,
  setLikeDis,
}) {
  const navigate = useNavigate();
  const cusID = JSON.parse(localStorage.getItem("user")).id;
  const playerRef = useRef(null);
  const [like, setLike] = useState(false);
  const { videoID } = useParams();
  const [totalComment, setTotalComment] = useState(0);
  const [dislike, setDislike] = useState(false);
  const [commentPopup, setCommentPopup] = useState(false);
  const [cmt, setCmt] = useState([]);
  const [reportPopup, setReportPopup] = useState(false);
  const [share, setShare] = useState(false);
  const [textReport, setTextReport] = useState();
  const [selectedValue, setSelectedValue] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [mess, setMess] = useState(false);
  const [commentMap, setCommentMap] = useState({});
  const [replyText, setReplyText] = useState("");
  const nullValue = null;
  useEffect(() => {
    setVideoID(videoID);
    fetchComment();
    const handleKeyDown = (e) => handleVideo(e);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentVideo, videoID]);
  useEffect(() => {
    if (currentVideo) {
      setLike(currentVideo.LikeDis == "like" ? true : false);
      setDislike(currentVideo.LikeDis == "dislike" ? true : false);
    }
    console.log(currentVideo);
  }, [currentVideo]);
  async function handleVideo(e) {
    switch (e.key) {
      case "ArrowUp":
        handleNextVideo(1);
        break;
      case "ArrowDown":
        handleNextVideo(-1);
        break;
      case "ArrowRight":
        playerRef.current.seekTo(
          playerRef.current.getCurrentTime() + 5,
          "seconds"
        );
        break;
      case "ArrowLeft":
        playerRef.current.seekTo(
          playerRef.current.getCurrentTime() - 5,
          "seconds"
        );
        break;
      default:
        break;
    }
  }
  const handleLike = async () => {
    let addLike = -1;
    let addDisLike = 0;
    if (!like) {
      addLike = 1;
      if (dislike) {
        addDisLike = -1;
      }
    }
    setLikeDis(addLike, addDisLike);
    setLike(!like);
    setDislike(false);
    await axios.post("http://localhost:3001/api/video/likeVideo", {
      videoID,
      addLike,
      addDisLike,
      cusID,
    });
  };
  const handleDislike = async () => {
    let addLike = 0;
    let addDisLike = -1;
    if (!dislike) {
      addDisLike = 1;
      if (like) {
        addLike = -1;
      }
    }
    setLikeDis(addLike, addDisLike);
    setDislike(!dislike);
    setLike(false);
    await axios.post("http://localhost:3001/api/video/likeVideo", {
      videoID,
      addLike,
      addDisLike,
      cusID,
    });
  };
  function shareUrl() {
    const urlshare = window.location.href;
    navigator.clipboard.writeText(urlshare);
    setShare(true);
    setTimeout(() => {
      setShare(false);
    }, 2000);
  }
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile({
      file: selectedFile,
      previewUrl: URL.createObjectURL(selectedFile),
      type: selectedFile.type.startsWith("image") ? "image" : "video",
    });
  };
  const handleUpload = async () => {
    if (!file || !selectedValue || !textReport) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("selectedValue", selectedValue);
      formData.append("videoID", videoID);
      formData.append("textReport", textReport);
      setMess(true);
      setTimeout(() => {
        setMess(false);
      }, 2000);
      const response = await axios.post(
        "http://localhost:3001/api/video/report",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    }
  };
  async function fetchComment() {
    const response = await axios.post(
      "http://localhost:3001/api/video/getCommentByVideoID",
      { videoID, cusID }
    );
    const commentList = response.data;
    const commentMa = {};
    const commentTree = [];
    setTotalComment(response.data.length);
    commentList.forEach((comment) => {
      commentMa[comment.comment.CommentID] = { ...comment, children: [] };
    });
    setCommentMap(commentMa);
    commentList.forEach((comment) => {
      if (comment.comment.ParentCmt) {
        commentMa[comment.comment.ParentCmt].children.push(
          commentMa[comment.comment.CommentID]
        );
      } else {
        commentTree.push(commentMa[comment.comment.CommentID]);
      }
    });
    setCmt(commentTree);
  }
  function setLikeDisComment(commentID, like, dislike) {
    const commentMa = commentMap;
    commentMa[commentID].comment.TotalDislike =
      commentMa[commentID].comment.TotalDislike + dislike;
    commentMa[commentID].comment.TotalLike =
      commentMa[commentID].comment.TotalLike + like;
    setCommentMap(commentMa);
  }
  const handleReply = async (parentCom, content) => {
    const commentsaisai = commentMap;
    const response = await axios.post(
      "http://localhost:3001/api/video/addComment",
      { videoID, content, parentCom, cusID }
    );
    const comment = {
      LikeDis: "",
      avatar: JSON.parse(localStorage.getItem("user")).avatar,
      cusName: JSON.parse(localStorage.getItem("user")).name,
      children: [],
      comment: response.data,
    };

    commentsaisai[comment.comment.CommentID] = comment;
    if (parentCom) {
      commentsaisai[parentCom].children.push(comment);
    } else {
      cmt.push(comment);
    }
    setCommentMap(commentsaisai);
    setCmt([...cmt]);
    setTotalComment(totalComment + 1);
  };
  async function handleShop() {
    await localStorage.setItem("shopID", currentVideo.ShopID);
    navigate("/Shop");
  }
  return (
    <>
      <div className={styles.videoContainer}>
        <div className={styles.videoInner}>
          <div className={styles.changeVideo}>
            <button
              className={`${currentVideoIndex === 0 ? styles.hidden : ""} ${
                styles.arowTop
              }`}
              onClick={() => handleNextVideo(-1)}
            >
              <img alt="" src="/arowbottom.png" />
            </button>
            <button onClick={() => handleNextVideo(1)}>
              <img alt="" src="/arowbottom.png" />
            </button>
          </div>
          <div className={styles.video}>
            <ReactPlayer
              ref={playerRef}
              url={currentVideo ? currentVideo.VideoUrl : ""}
              loop
              playing
              muted
              controls
              height="90vh"
              width="50.62vh"
            />
          </div>
          <div className={styles.functionVideo}>
            <div>
              <button
                onClick={() => handleLike()}
                className={`${like ? styles.choose : ""}`}
              >
                <img alt="" src="/likeIcon.png" />
              </button>
              {currentVideo ? currentVideo.TotalLike : ""}
            </div>
            <div>
              <button
                onClick={() => handleDislike()}
                className={`${dislike ? styles.choose : ""}`}
              >
                <img alt="" src="/dislikeIcon.png" />
              </button>
              {currentVideo ? currentVideo.TotalDislike : ""}
            </div>
            <div>
              <button onClick={() => setCommentPopup(true)}>
                <img alt="" src="/cmtIcon.png" />
              </button>
              {totalComment}
            </div>
            <div>
              <button onClick={() => shareUrl()}>
                <img alt="" src="/shareIcon.png" />
              </button>
              Chia sẻ
              {share ? (
                <div className={styles.share}>Đã sao chép đường dẫn</div>
              ) : (
                ""
              )}
            </div>
            <div>
              <button onClick={() => setReportPopup(true)}>
                <img alt="" src="/reportIcon1.png" />
              </button>
              Phản hồi
            </div>
            <div>
              <button onClick={() => handleShop()}>
                <img alt="" src={currentVideo ? currentVideo.ShopAvatar : ""} />
              </button>
              {currentVideo ? currentVideo.ShopName : ""}
            </div>
          </div>
        </div>
        {reportPopup ? (
          <div className={styles.Videofunc}>
            <h3 onClick={(e) => setReportPopup(false)}>X</h3>
            <h4>Phản hồi về thước phim</h4>
            <p>Lỗi vi phạm</p>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="" style={{ display: "none" }}>
                Chọn lỗi vi phạm
              </option>
              <option value="Sexual content">Nội dung khiêu dâm</option>
              <option value="Misinformation">Thông tin sai lệch</option>
              <option value="Violent content">Nội dung bạo lực</option>
              <option value="Child abuse">Lạm dụng trẻ em</option>
              <option value="repulsive content">Nội dung phản cảm</option>
              <option value="Legal issue">Vấn đề pháp lý</option>
              <option value="Other">Khác</option>
            </select>
            <p> Hãy cho chúng tôi biết phản hồi của bạn. </p>
            <textarea
              value={textReport}
              onChange={(e) => setTextReport(e.target.value)}
              placeholder="Phản hồi của bạn..."
              rows="5"
              cols="50"
            />
            <p>Ảnh/video vi phạm(nếu có) giúp chúng tôi dễ dàng xác định </p>
            <input
              style={{ marginBottom: "20px" }}
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            {file && (
              <div>
                {file.type === "image" ? (
                  <img src={file.previewUrl} alt="Preview" width="200px" />
                ) : (
                  <ReactPlayer
                    ref={playerRef}
                    url={file.previewUrl}
                    loop
                    playing
                    className={styles.videoPrev}
                    muted
                    controls
                  />
                )}
              </div>
            )}
            <button
              style={{ marginTop: "20px", display: "block" }}
              onClick={() => handleUpload()}
            >
              Phản hồi
            </button>
          </div>
        ) : (
          ""
        )}
        {commentPopup && cmt ? (
          <div className={styles.Videofunc}>
            <h3 onClick={(e) => setCommentPopup(false)}>X</h3>
            <h4>Comment</h4>
            <div
              style={{
                overflow: "scroll",
                width: "100%",
                scrollbarWidth: "none",
                height: "67vh",
              }}
            >
              {cmt.map((item) => (
                <Comment
                  key={item.comment.CommentID}
                  handleReply={handleReply}
                  comment={item}
                  setLikeDis={setLikeDisComment}
                />
              ))}
            </div>
            <div className={styles.aply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Cảm nghĩ của bạn..."
              />
              <button onClick={() => handleReply(nullValue, replyText)}>
                Gửi
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {error ? (
        <div className={styles.share}>Hãy nhập đủ các thông tin</div>
      ) : (
        ""
      )}
      {mess ? <div className={styles.share}>Báo cáo thành công</div> : ""}
    </>
  );
}

export default VideoComponent;

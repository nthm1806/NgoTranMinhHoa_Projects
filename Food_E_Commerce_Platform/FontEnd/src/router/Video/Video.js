import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../../layout/Header/Header";
import axios from "axios";
import VideoComponent from "../../components/VideoCom/VideoComponent";

function Video() {
  const navigate = useNavigate();
  const cusID = JSON.parse(localStorage.getItem("user")).id;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoList, setVideoList] = useState([]);
  const [videoID, setVideoID] = useState(cusID);
  function setLikeDis(like, dislike) {
    setVideoList((prevList) => {
      const newList = prevList.map((video, index) => {
        if (index === currentVideoIndex) {
          if (like == 1)
            return {
              ...video,
              TotalLike: video.TotalLike + like,
              TotalDislike: video.TotalDislike + dislike,
              LikeDis: "like",
            };
          else if (dislike == 1)
            return {
              ...video,
              TotalLike: video.TotalLike + like,
              TotalDislike: video.TotalDislike + dislike,
              LikeDis: "dislike",
            };
          else
            return {
              ...video,
              TotalLike: video.TotalLike + like,
              TotalDislike: video.TotalDislike + dislike,
              LikeDis: "",
            };
        }
        return video;
      });
      return [...newList];
    });
  }
  const handleNextVideo = (value) => {
    const newCurrent =
      (currentVideoIndex + value + videoList.length) % videoList.length;
    setCurrentVideoIndex(newCurrent);
    const videoI = videoList[newCurrent].VideoID;
    navigate(`/video/${videoI}`);
  };
  useEffect(() => {
    fetchVideo();
  }, [videoID]);
  const fetchVideo = async () => {
    console.log(videoList);
    if (videoList.length === 0) {
      const res = await axios.post(
        "http://localhost:3001/api/video/getVideoByID",
        { videoID, cusID }
      );
      console.log(res.data);
      setVideoList(res.data);
    }
  };
  return (
    <>
      <Header></Header>
      <Routes>
        <Route
          path="/:videoID"
          element={
            <VideoComponent
              setVideoID={setVideoID}
              currentVideo={videoList[currentVideoIndex]}
              currentVideoIndex={currentVideoIndex}
              handleNextVideo={handleNextVideo}
              setLikeDis={setLikeDis}
            />
          }
        />
      </Routes>
    </>
  );
}

export default Video;

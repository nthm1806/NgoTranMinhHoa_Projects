import React, { useEffect, useRef, useState } from "react";
import styles from "./GameCanvas.module.css"; 
import axios from "axios";
import { useAuth } from "../../../src/globalContext/AuthContext";
import ShopPopup from "./ShopPopup";
import Wheel from "./Wheel";


const GameCanvas = () => {
  const { customerID } = useAuth();
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const birdY = useRef(window.innerHeight / 2);
  const velocity = useRef(0);
  const gameRunning = useRef(true);
  const pipes = useRef([]);
  const coins = useRef([]);

  const gravity = 0.05;
  const jump = -3.2;
  const pipeGap = window.innerHeight / 4;
  const pipeWidth = 80;
  const pipeSpeed = 3;
  const pipeSpacing = window.innerWidth / 3;

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [customerCoin, setCustomerCoin] = useState(0);
  const [doubleCoin, setDoubleCoin] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);


  const backgroundImage = new Image();
  backgroundImage.src = "/background.jpg"; 

  //Hàm đếm ngược
  const startCountdown = (duration, type) => {
    const endTime = Date.now() + duration * 1000; // Thời gian kết thúc
    setCountdown(duration);
  
    if (type === "doubleCoin") {
      setDoubleCoin(true);
      localStorage.setItem("doubleCoin", JSON.stringify({ endTime }));
    } 
  
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setCountdown(remainingTime);
  
      if (remainingTime <= 0) {
        clearInterval(interval);
  
        if (type === "doubleCoin") {
          setDoubleCoin(false);
          localStorage.removeItem("doubleCoin");
        } 
      }
    }, 1000);
  };
  

  // Kiểm tra hiệu ứng đã mua khi load game
  useEffect(() => {
    const checkEffectExpiration = () => {
      const now = Date.now();
  
      const savedDoubleCoin = localStorage.getItem("doubleCoin");
      if (savedDoubleCoin) {
        const { endTime } = JSON.parse(savedDoubleCoin);
        const remainingTime = Math.floor((endTime - now) / 1000);
        if (remainingTime > 0) {
          setDoubleCoin(true);
          startCountdown(remainingTime, "doubleCoin");
        } else {
          setDoubleCoin(false);
          localStorage.removeItem("doubleCoin");
        }
      }
  
    };
  
    checkEffectExpiration();
  }, []);
  
  
  //  Fetch số xu ngay khi vào trang
  useEffect(() => {
    const fetchCustomerCoin = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/customers/${customerID}`);
        setCustomerCoin(response.data.xu);
      } catch (error) {
        console.error("❌ Lỗi khi lấy số xu:", error);
      }
    };

    fetchCustomerCoin();
  }, [customerID]); //  Chỉ chạy 1 lần khi component mount hoặc customerID thay đổi

  //  Hàm cập nhật xu lên server
  const updateCustomerCoin = async (amount) => {
    try {
      setCustomerCoin((prev) => {
        const newCoin = prev + amount;

        axios.put(`http://localhost:3001/customers/${customerID}`, { xu: newCoin })
          .catch(error => console.error("❌ Lỗi khi cập nhật xu:", error));

        return newCoin;
      });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật xu:", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    backgroundImage.onload = () => {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

    const handleJump = (event) => {
      if ( event.code === "KeyH") {
        if (!isGameOver) {
          velocity.current = jump;
        } else {
          restartGame();
        }
      }
    };

    document.addEventListener("keydown", handleJump);

    function createPipe() {
      let lastPipe = pipes.current[pipes.current.length - 1];
      if (!lastPipe || lastPipe.x < canvas.width - pipeSpacing) {
        let minHeight = 50;
        let maxHeight = canvas.height - pipeGap - minHeight;
        let topPipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        pipes.current.push({
          x: canvas.width,
          y: topPipeHeight,
          passed: false,
        });

        let coinY = topPipeHeight + pipeGap / 2;
        coins.current.push({ x: canvas.width + pipeWidth / 2, y: coinY, collected: false });
      }

      setTimeout(createPipe, 2000);
    }

    function update() {
      if (!gameRunning.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(canvas.width / 6, birdY.current, 20, 0, Math.PI * 2);
      ctx.fill();

      velocity.current += gravity;
      birdY.current += velocity.current;

      pipes.current.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);

        if (
          (canvas.width / 6 > pipe.x &&
            canvas.width / 6 < pipe.x + pipeWidth &&
            (birdY.current < pipe.y || birdY.current > pipe.y + pipeGap)) ||
          birdY.current > canvas.height
        ) {
          setIsGameOver(true);
          gameRunning.current = false;
          return;
        }

        if (!pipe.passed && pipe.x + pipeWidth < canvas.width / 6) {
          pipe.passed = true;
          let addedScore = 1; 
          scoreRef.current += addedScore;
          setScore(scoreRef.current);
        }

        if (pipe.x < -pipeWidth) {
          pipes.current.splice(index, 1);
        }
      });

      coins.current.forEach((coin, index) => {
        coin.x -= pipeSpeed;

        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        ctx.fill();

        let birdX = canvas.width / 6;
        let dist = Math.sqrt((birdX - coin.x) ** 2 + (birdY.current - coin.y) ** 2);
        if (dist < 25 && !coin.collected) {
          coin.collected = true;
          let coinAmount = doubleCoin ? 2 : 1;
          updateCustomerCoin(coinAmount);
        }

        if (coin.collected || coin.x < -10) {
          coins.current.splice(index, 1);
        }
      });

      if (gameRunning.current) {
        gameRunning.current = requestAnimationFrame(update);
      }
    }

    function restartGame() {
      if (customerCoin < 30) {
        alert("Bạn không đủ xu để chơi!");
        return;
      }

      cancelAnimationFrame(gameRunning.current);
      birdY.current = canvas.height / 2;
      velocity.current = 0;
      pipes.current = [];
      coins.current = [];
      scoreRef.current = 0;
      setScore(0);
      setIsGameOver(false);
      gameRunning.current = true;

      updateCustomerCoin(-30);
      
      createPipe();
      update();
      
    }

    if (gameStarted) {
      createPipe();
      update();
    }

    return () => {
      document.removeEventListener("keydown", handleJump);
      document.removeEventListener("click", handleJump);
    };
  }, [isGameOver, gameStarted]);

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.score}>Score: {score}</h2>
      <p>💰 Số xu của bạn: <strong>{customerCoin}</strong></p>
      <h3>Ấn H để chơi (-30xu/ lượt)</h3>
      {doubleCoin && <p>🔥 Nhân đôi xu còn: {countdown} giây</p>}
  
      {!gameStarted && (
        <button
          className={styles.startButton}
          onClick={() => {
            if (customerCoin < 30) {
              alert("Bạn không đủ xu để chơi!");
              return;
            }
  
            updateCustomerCoin(-30);
            setGameStarted(true);
          }}
        >
          Chơi Ngay
        </button>
      )}
  
      {isGameOver && (
        <div className={styles.gameOver}>
          <h3>Game Over!</h3>
          <h3>Điểm của bạn: {score}</h3>
          <button className={styles.restartButton} onClick={() => setGameStarted(true)}>
            Chơi Lại
          </button>
        </div>
      )}
  
      {/* Bọc hai nút Quay Vòng & Cửa Hàng trong buttonContainer */}
      <div className={styles.buttonContainer}>
        <button className={styles.wheelButton} onClick={() => setIsWheelOpen(true)}>🎡 Quay Vòng May Mắn</button>
        <button className={styles.shopButton} onClick={() => setShopOpen(true)}>🛒 Cửa hàng</button>
      </div>
  
      {/* Hiển thị popup khi mở */}
      {shopOpen && (
        <ShopPopup
          customerCoin={customerCoin}
          updateCustomerCoin={updateCustomerCoin}
          closeShop={() => setShopOpen(false)}
          setDoubleCoin={setDoubleCoin}
          startCountdown={startCountdown}
        />
      )}
  
      {isWheelOpen && (
        <Wheel 
          customerID={customerID} // Truyền customerID vào Wheel
          customerCoin={customerCoin}
          updateCustomerCoin={updateCustomerCoin}
          closeWheel={() => setIsWheelOpen(false)} 
        />

      )}
  
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
  
  
};

export default GameCanvas;

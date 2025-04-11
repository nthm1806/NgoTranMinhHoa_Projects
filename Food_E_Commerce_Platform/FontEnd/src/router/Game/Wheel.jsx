import React, { useState, useEffect } from "react";
import styles from "./Wheel.module.css";
import axios from "axios";

const Wheel = ({ customerID, closeWheel }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [customerCoin, setCustomerCoin] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false); // Kiểm soát hiển thị kết quả

  const prizes = [
    { label: "🎁 50 xu", value: 50, probability: 0 },
    { label: "🎁 20 xu", value: 20, probability: 0 },
    { label: "🎁 10 xu", value: 10, probability: 0 },
    { label: "💔 Chúc may mắn lần sau", value: 0, probability: 100 },
  ];

  const weightedPrizes = [];
  prizes.forEach((prize) => {
    for (let i = 0; i < prize.probability; i++) {
      weightedPrizes.push(prize);
    }
  });

  const updateCustomerCoin = async (amount) => {
    try {
      setCustomerCoin((prev) => {
        const newCoin = prev + amount;
        axios
          .put(`http://localhost:3001/customers/${customerID}`, { xu: newCoin })
          .catch((error) => console.error("❌ Lỗi khi cập nhật xu:", error));
        return newCoin;
      });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật xu:", error);
    }
  };

  useEffect(() => {
    const fetchCustomerCoin = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/customers/${customerID}`
        );
        setCustomerCoin(response.data.xu);
      } catch (error) {
        console.error("❌ Lỗi khi lấy số xu:", error);
      }
    };

    fetchCustomerCoin();
  }, [customerID]);

  const resetWheel = () => {
    setRotation(0);
    setSelectedPrize(null);
    setShowResult(false);
  };

  const spinWheel = () => {
    if (isSpinning || customerCoin < 30) {
      alert("Bạn không đủ xu để quay!");
      return;
    }

    resetWheel(); // Reset vòng quay trước mỗi lần quay mới

    setIsSpinning(true);
    updateCustomerCoin(-30); // Trừ 30 xu trước khi quay

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * weightedPrizes.length);
      const result = weightedPrizes[randomIndex];

      setSelectedPrize(result);

      // Tính toán góc quay
      const prizeIndex = prizes.findIndex((p) => p.label === result.label);
      const segmentAngle = 360 / prizes.length;
      const offset = 200;
      const finalRotation = 360 * 5 - segmentAngle * prizeIndex + offset;

      setRotation(finalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);

        // 🏆 Cập nhật số xu khi vòng quay hoàn tất
        if (result.value > 0) {
          updateCustomerCoin(result.value);
        }
      }, 3000);
    }, 3000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.wheelPopup}>
        <h2>🎡 Vòng quay may mắn</h2>
        <p>💰 Xu của tôi: {customerCoin}</p>
        <div className={styles.wheelContainer}>
          {/* Mũi tên chỉ vào phần thưởng */}
          <div className={styles.pointer}></div>

          <div
            className={styles.wheel}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={styles.segment}
                style={{
                  transform: `rotate(${(360 / prizes.length) * index}deg)`,
                }}
              >
                <span className={styles.segmentText}>{prize.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hiển thị kết quả sau khi vòng quay dừng */}
        <p className={`${styles.result} ${showResult ? styles.show : ""}`}>
          🎊 Kết quả: {selectedPrize?.label}
        </p>

        {/* Hai nút đặt cạnh nhau */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.spinButton}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? "Đang quay..." : "Quay....(-30 xu)"}
          </button>
          <button className={styles.closeButton} onClick={closeWheel}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wheel;

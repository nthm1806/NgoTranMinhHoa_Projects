import React, { useState, useEffect } from "react";
import styles from "./ShopPopup.module.css";

const ShopPopup = ({ 
    customerCoin, 
    updateCustomerCoin, 
    closeShop, 
    setDoubleCoin,  
    startCountdown 
}) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000); // Ẩn sau 3 giây
    };

    const purchaseItem = (item, cost) => {
        if (customerCoin < cost) {
            showNotification("❌ Bạn không đủ xu!");
            return;
        }

        updateCustomerCoin(-cost);
        const duration = 60; // 10 giây (hoặc 300 giây = 5 phút)
        const endTime = Date.now() + duration * 1000;

        if (item === "doubleCoin") {
            setDoubleCoin(true);
            localStorage.setItem("doubleCoin", JSON.stringify({ endTime }));
            startCountdown(duration, "doubleCoin");
            showNotification("✅ Bạn đã mua Nhân đôi xu!");
        }
    };

    return (
        <div className={styles.shopPopup}>
            <div className={styles.shopContent}>
                <h2>🛒 Cửa hàng</h2>
                <p>💰 Xu hiện tại: {customerCoin}</p>

                <div className={styles.items}>
                    <div className={styles.item}>
                        <h3>Nhân đôi xu</h3>
                        <p>Giá: 50 xu</p>
                        <button
                            disabled={customerCoin < 50}
                            onClick={() => purchaseItem("doubleCoin", 50)}
                        >
                            Mua
                        </button>
                    </div>
                </div>

                <button className={styles.closeButton} onClick={closeShop}>
                    Đóng
                </button>
            </div>

            {notification && (
                <div className={styles.notificationPopup}>
                    <p>{notification}</p>
                </div>
            )}
        </div>
    );
};

export default ShopPopup;

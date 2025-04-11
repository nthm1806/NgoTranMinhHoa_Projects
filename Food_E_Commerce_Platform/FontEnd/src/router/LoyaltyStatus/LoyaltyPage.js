import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoyaltyPage.css";
import Header from "../../layout/Header/Header";

const LoyaltyPage = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [loyaltyInfo, setLoyaltyInfo] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/loyalty/${customerId}`)
            .then(res => {
                console.log("Dữ liệu API nhận được:", res.data);
                setLoyaltyInfo(res.data || null);
            })
            .catch(err => {
                console.error("Lỗi khi lấy dữ liệu:", err);
                setLoyaltyInfo(null);
            });
    }, [customerId]);

    if (!loyaltyInfo) return <div className="loading">Loading...</div>;

    const {
        currentTier,
        totalOrders,
        totalSpent,
        name,
        rewards,
        tierThresholds
    } = loyaltyInfo;

    // Sắp xếp thứ hạng theo điều kiện tăng dần
    const sortedTiers = [...tierThresholds].sort((a, b) => a.required_orders - b.required_orders);
    const tierNames = sortedTiers.map(t => t.tier);
    const currentIndex = tierNames.indexOf(currentTier);
    const nextTier = tierNames[currentIndex + 1] || null;

    const nextTierGoal = nextTier
        ? sortedTiers.find(t => t.tier === nextTier)
        : null;

    const ordersProgress = nextTierGoal
        ? (totalOrders / nextTierGoal.required_orders) * 100
        : 100;

    const spentProgress = nextTierGoal
        ? (totalSpent / nextTierGoal.required_spent) * 100
        : 100;

    // Tìm icon của tier hiện tại
    const currentTierInfo = sortedTiers.find(t => t.tier === currentTier);
    const currentTierIcon = currentTierInfo?.icon || "";

    return (
        <>
            <Header />
            <div className="loyalty-container">
                {/* Thẻ banner cam với info cơ bản */}
                <div className="loyalty-card loyalty-banner">
                    <div className="loyalty-banner-content">
                        <div className="loyalty-tier-header">
                            <div className="user-info-left">
                                <h2 className="member-title">THÀNH VIÊN</h2>
                                <p className="loyalty-name">
                                    {name}
                                    {currentTierIcon && (
                                        <img
                                            src={currentTierIcon}
                                            alt={currentTier}
                                            className="tier-icon-inline"
                                        />
                                    )}
                                </p>
                                <p className="loyalty-tier-name">
                                    Hạng hiện tại: <strong>{currentTier}</strong>
                                </p>
                            </div>
                            <button
                                className="loyalty-detail-btn"
                                onClick={() => navigate(`/loyalty-history/${customerId}`)}
                            >
                                Chi tiết
                            </button>
                        </div>

                        {nextTier && nextTierGoal && (
                            <div className="loyalty-progress-card">
                                <p className="upgrade-title">Để nâng thứ hạng tiếp theo ({nextTier})</p>
                                <div className="progress-row">
                                    <div className="progress-column">
                                        <p>Đơn hàng</p>
                                        <p className="highlight">
                                            {totalOrders}/{nextTierGoal.required_orders}
                                        </p>
                                        <div className="bar">
                                            <div className="fill" style={{ width: `${ordersProgress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-column">
                                        <p>Chi tiêu</p>
                                        <p className="highlight">
                                            {totalSpent.toLocaleString()}₫ / {nextTierGoal.required_spent.toLocaleString()}₫
                                        </p>
                                        <div className="bar">
                                            <div className="fill" style={{ width: `${spentProgress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="update-note">Thứ hạng sẽ được cập nhật lại sau 30.06.2025</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ưu đãi */}
                <div className="loyalty-card loyalty-rewards">
                    <h3>Ưu đãi dành cho bạn</h3>
                    <ul className="reward-list">
                        {rewards.map((reward, index) => (
                            <li key={index} className="reward-item">
                                <img
                                    src={reward.icon}
                                    className="reward-icon"
                                    alt={reward.reward_name}
                                />
                                <div className="reward-details">
                                    <strong>{reward.reward_name}</strong><br />
                                    <span>{reward.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default LoyaltyPage;

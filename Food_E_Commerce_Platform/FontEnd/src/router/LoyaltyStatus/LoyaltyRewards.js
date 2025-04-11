import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoyaltyRewards = ({ customerId }) => {
    const [loyaltyData, setLoyaltyData] = useState(null);

    useEffect(() => {
        axios.get(`/api/loyalty/${customerId}`)
            .then(response => setLoyaltyData(response.data))
            .catch(error => console.error("Lỗi khi lấy dữ liệu loyalty:", error));
    }, [customerId]);

    if (!loyaltyData) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Hạng: {loyaltyData.currentTier}</h2>
            <p>Tổng đơn hàng: {loyaltyData.totalOrders}</p>
            <p>Tổng tiền đã chi: {loyaltyData.totalSpent.toLocaleString()} VND</p>

            <h3 className="mt-4 text-lg font-semibold">Ưu đãi của bạn:</h3>
            <ul className="mt-2">
                {loyaltyData.rewards.length > 0 ? (
                    loyaltyData.rewards.map((reward, index) => (
                        <li key={index} className="p-2 border-b">
                            <strong>{reward.reward_name}</strong>: {reward.description}
                        </li>
                    ))
                ) : (
                    <p>Không có ưu đãi nào cho hạng này.</p>
                )}
            </ul>
        </div>
    );
};

export default LoyaltyRewards;

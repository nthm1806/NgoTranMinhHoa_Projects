import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import './ActivityLog.module.css';

const ActivityLog = () => {
    const userID = 2;
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/activitylogs/${userID}`);
                const data = await response.json();
                console.log("Dữ liệu nhận được từ API:", data);
                setLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, [userID]);

    return (
        <div className="activity-log-container">
            <Header />
            <h2 className="activity-log-title">Nhật ký hoạt động</h2>
            <button onClick={() => navigate(-1)}>Quay lại trang trước</button>
            {logs.length === 0 ? (
                <p className="text-gray-500 text-center">Không có nhật ký hoạt động nào!</p>
            ) : (
                <ul className="activity-log-list">
                    {logs.map((log) => (
                        <li key={log.id} className="activity-log-item">
                            <p>Hoạt động: {log.action}</p>
                            <p className="activity-log-time">
                                Thời gian: {new Date(log.timestamp).toLocaleString()}
                            </p>

                            {/* Hiển thị thông tin liên quan nếu có */}
                            {log.product_id && <p>Sản phẩm ID: {log.product_id}</p>}
                            {log.order_id && <p>Đơn hàng ID: {log.order_id}</p>}
                            {log.favorite_id && <p>Yêu thích ID: {log.favorite_id}</p>}
                            {log.review_id && <p>Đánh giá ID: {log.review_id}</p>}

                            {/* Hiển thị details nếu có */}
                            {log.details && typeof log.details === "string" && (
                                <pre className="activity-log-details">
                                    {log.details}
                                </pre>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <Footer />
        </div>
    );
};

export default ActivityLog;
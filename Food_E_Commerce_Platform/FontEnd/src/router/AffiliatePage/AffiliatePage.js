import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AffiliatePage.module.css";
import Header from "../../layout/Header/Header";

const AffiliatePage = () => {
    const { customerId } = useParams();
    const [stats, setStats] = useState([]);
    const [history, setHistory] = useState([]);
    const [userName, setUserName] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAffiliateData();
        fetchAffiliateHistory();
        fetchCustomerName();
    }, [customerId]);

    const fetchAffiliateData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/affiliate/stats/${customerId}`);
            setStats(res.data);
        } catch {
            setStats([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAffiliateHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/affiliate/history/${customerId}`);
            setHistory(res.data);
        } catch {
            setHistory([]);
        }
    };

    const fetchCustomerName = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/customers/${customerId}`);
            setUserName(`${res.data.FirstName} ${res.data.LastName}`);
        } catch {
            setUserName("Khách hàng");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Đang xử lý...");
        setSuccess(false);

        try {
            const res = await axios.post("http://localhost:3001/api/affiliate/track", {
                customerId,
                customCode,
            });

            setMessage(res.data.message);
            setSuccess(true);
            setCustomCode("");
            fetchAffiliateData();
            fetchAffiliateHistory();
        } catch (error) {
            setMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
            setSuccess(false);
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.banner}>
                    <h2 className={styles.title}>Chương trình Tiếp Thị Liên Kết</h2>
                    <p className={styles.userName}>{userName}</p>

                    <div className={styles.statsBox}>
                        {loading ? (
                            <p className={styles.loading}>Đang tải dữ liệu...</p>
                        ) : stats.length > 0 ? (
                            stats.map((item, index) => (
                                <div key={index} className={styles.statsItem}>
                                    <span className={styles.label}>Mã:</span> {item.CustomCode}
                                    <span className={styles.label}>Số người nhập:</span> {item.Clicks}
                                    <span className={styles.label}>Xu:</span> {item.xu ?? 0}
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>Chưa có mã tiếp thị nào.</p>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Nhập mã tiếp thị mới</h3>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Nhập mã tiếp thị..."
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button type="submit" className={styles.button}>Gửi</button>
                    </form>
                    {message && (
                        <p className={success ? styles.success : styles.error}>{message}</p>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Lịch sử sử dụng mã</h3>
                    <div className={styles.historyBox}>
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={index} className={styles.historyItem}>
                                    <strong>{item.FirstName} {item.LastName}</strong> đã nhập mã <strong>{item.CustomCode}</strong>
                                    <span className={styles.date}>{new Date(item.CreatedAt).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noData}>Chưa có lịch sử tiếp thị.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AffiliatePage;

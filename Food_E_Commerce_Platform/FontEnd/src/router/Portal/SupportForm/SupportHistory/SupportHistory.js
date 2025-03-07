import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SupportHistory.module.css";
import Header from "../../../../layout/Header/Header";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";

const SupportHistory = () => {
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/api/support/requests/1")
            .then(response => setRequests(response.data))
            .catch(error => console.error("Lỗi khi tải lịch sử yêu cầu!", error));
    }, []);

    const filteredRequests = requests.filter(req =>
        req.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className={styles.headerWrapper}>
                <Header />
            </div>
            <div className={styles.breadcrumb}>
                <Breadcrumb />
            </div>
            <div className={styles.historyContainer}>
                <h2 className={styles.historyTitle}>Lịch Sử Yêu Cầu Hỗ Trợ</h2>

                <input
                    className={styles.historySearch}
                    type="text"
                    placeholder="Tìm kiếm yêu cầu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <ul className={styles.requestList}>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <li
                                key={req.id}
                                className={styles.requestItem}
                                onClick={() => navigate(`/support/history/${req.id}`)}
                            >
                                <p><strong>Loại Yêu Cầu:</strong> {req.category_name}</p>
                                <p><strong>Tiêu đề:</strong> {req.subject}</p>
                                <p className={styles.requestStatus}>
                                    {req.status === "pending" ? "Đang chờ xử lý" :
                                        req.status === "in_progress" ? "Đang xử lý" : "Đã giải quyết"}
                                </p>
                                <p className={styles.requestTime}>{new Date(req.created_at).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Không có yêu cầu nào.</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default SupportHistory;

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SupportHistory.module.css";
import Header from "../../../../layout/Header/Header";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";

const SupportHistory = () => {
    const [requests, setRequests] = useState([]);
    const [categories, setCategories] = useState({});
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // Bộ lọc trạng thái
    const { customerId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/support/requests/${customerId}`)
            .then(response => setRequests(response.data))
            .catch(error => console.error("Lỗi khi tải lịch sử yêu cầu!", error));

        axios.get("http://localhost:3001/api/support/categories")
            .then(response => {
                const categoryMap = {};
                response.data.forEach(cat => {
                    categoryMap[cat.id] = cat.name;
                });
                setCategories(categoryMap);
            })
            .catch(error => console.error("Lỗi khi tải danh sách category!", error));
    }, [customerId]);


    // Lọc theo tiêu đề và trạng thái
    const filteredRequests = requests.filter(req =>
        req.subject.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "" || req.status === statusFilter)
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

                <div className={styles.filters}>
                    <input
                        className={styles.historySearch}
                        type="text"
                        placeholder="Tìm kiếm yêu cầu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select className={styles.statusFilter} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Đang chờ xử lý</option>
                        <option value="in_progress">Đang xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                    </select>
                </div>

                <ul className={styles.requestList}>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <li
                                key={req.id}
                                className={styles.requestItem}
                                onClick={() => navigate(`/support/history/${customerId}/${req.id}`)}

                            >
                                <p><strong>Loại Yêu Cầu:</strong> {categories[req.category] || "Không xác định"}</p>
                                <p><strong>Tiêu đề:</strong> {req.subject}</p>
                                <p className={`${styles.requestStatus} ${req.status === "pending" ? styles.statusPending
                                    : req.status === "in_progress" ? styles.statusInProgress
                                        : styles.statusResolved}`}>
                                    {req.status === "pending" ? "Đang chờ xử lý"
                                        : req.status === "in_progress" ? "Đang xử lý"
                                            : "Đã giải quyết"}
                                </p>

                                <p className={styles.requestTime}>{new Date(req.created_at).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <p>Không có yêu cầu nào.</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default SupportHistory;

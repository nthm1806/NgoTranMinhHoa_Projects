import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SupportRequestDetails.module.css";
import Header from "../../../../layout/Header/Header";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";

const SupportRequestDetails = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy chi tiết yêu cầu theo ID từ URL
        axios.get(`http://localhost:3001/api/support/request/${id}`)
            .then(response => {
                setRequest(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải yêu cầu!", error);
                setLoading(false);
            });

        // Lấy danh sách category từ database
        axios.get("http://localhost:3001/api/support/categories")
            .then(response => {
                const categoryMap = {};
                response.data.forEach(cat => {
                    categoryMap[cat.id] = cat.name; // Chuyển từ {id: name} => {1: "Khôi phục tài khoản", 2: "Lỗi kỹ thuật"}
                });
                setCategories(categoryMap);
            })
            .catch(error => console.error("Lỗi khi tải danh sách category!", error));
    }, [id]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!request) return <p>Không tìm thấy yêu cầu!</p>;

    return (
        <div>
            <div className={styles.headerWrapper}>
                <Header />
            </div>
            <Breadcrumb />
            <div className={styles.detailsContainer}>
                <h2 className={styles.detailsTitle}>Chi Tiết Yêu Cầu Hỗ Trợ</h2>

                <div className={styles.requestDetails}>
                    <label>Loại Yêu Cầu:</label>
                    <input type="text"
                        value={categories[request.category] || "Không xác định"}
                        disabled
                    />

                    <label>Tiêu đề:</label>
                    <input type="text" value={request.subject} disabled />

                    <label>Mô tả:</label>
                    <textarea rows="4" value={request.details} disabled></textarea>

                    <label>Trạng thái:</label>
                    <input type="text" value={
                        request.status === "pending" ? "Đang chờ xử lý"
                            : request.status === "in_progress" ? "Đang xử lý"
                                : "Đã giải quyết"
                    } disabled />
                </div>

                <button className={styles.backButton} onClick={() => navigate("/support/history")}>Quay lại</button>
            </div>
        </div>
    );
};

export default SupportRequestDetails;

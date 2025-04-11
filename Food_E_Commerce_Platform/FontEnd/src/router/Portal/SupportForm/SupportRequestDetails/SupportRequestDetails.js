import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../SupportRequest/SupportRequest.module.css";
import Header from "../../../../layout/Header/Header";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";

const SupportRequestDetails = () => {
    const { id, customerId } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [subject, setSubject] = useState("");
    const [details, setDetails] = useState("");
    const [status, setStatus] = useState("");
    const [requestStatus, setRequestStatus] = useState("");
    const [showSuccess, setShowSuccess] = useState(false); // 💡 alert đẹp sau khi xóa

    useEffect(() => {
        axios.get("http://localhost:3001/api/support/categories")
            .then(response => setCategories(response.data))
            .catch(error => console.error("Lỗi khi tải danh mục hỗ trợ!", error));

        axios.get(`http://localhost:3001/api/support/request/${id}`)
            .then(response => {
                const requestData = response.data;
                setCategoryId(requestData.category);
                setSubject(requestData.subject);
                setDetails(requestData.details);
                setRequestStatus(requestData.status);
            })
            .catch(error => console.error("Lỗi khi tải chi tiết yêu cầu!", error));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/support/request/${id}`, {
                subject,
                details,
                category: categoryId
            });
            setStatus("✅ Cập nhật yêu cầu thành công!");
        } catch (error) {
            setStatus("❌ Lỗi khi cập nhật yêu cầu!");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) return;
        try {
            await axios.delete(`http://localhost:3001/api/support/request/${id}`);
            setShowSuccess(true);
            setTimeout(() => {
                navigate(`/support/history/${customerId}`); // ✅ điều hướng đúng route
            }, 1500);
        } catch (error) {
            setStatus("❌ Lỗi khi xóa yêu cầu!");
        }
    };

    return (
        <div>
            <div className={styles.headerWrapper}>
                <Header />
            </div>


            <div className={styles.supportContainer}>
                <Breadcrumb />
                <h2 className={styles.supportTitle}>Chi Tiết Yêu Cầu Hỗ Trợ</h2>

                {status && (
                    <p className={`${styles.supportMessage} ${status.includes("Lỗi") ? styles.errorMessage : styles.successMessage}`}>
                        {status}
                    </p>
                )}

                {showSuccess && (
                    <p className={styles.successMessage}> Xóa yêu cầu thành công!</p>
                )}

                <form onSubmit={handleUpdate} className={styles.supportForm}>
                    <label>Loại Yêu Cầu:</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={requestStatus !== "pending"}
                    >
                        <option value="">Chọn loại yêu cầu</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <label>Tiêu đề:</label>
                    <input
                        type="text"
                        placeholder="Chủ đề"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={requestStatus !== "pending"}
                    />

                    <label>Mô tả:</label>
                    <textarea
                        rows="4"
                        placeholder="Mô tả chi tiết vấn đề của bạn"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                        disabled={requestStatus !== "pending"}
                    ></textarea>

                    {requestStatus === "pending" && (
                        <button type="submit">Lưu Cập Nhật</button>
                    )}
                </form>

                {requestStatus === "pending" && (
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        Xóa Yêu Cầu
                    </button>
                )}

                <button
                    className={styles.backButton}
                    onClick={() => navigate(`/support/history/${customerId}`)}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default SupportRequestDetails;

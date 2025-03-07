import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../SupportRequest/SupportRequest.module.css';


import Header from "../../../../layout/Header/Header";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";

const SupportRequest = () => {
    const [categories, setCategories] = useState([]); // Lưu danh sách categories
    const [categoryId, setCategoryId] = useState(""); // Lưu ID thay vì name
    const [subject, setSubject] = useState("");
    const [details, setDetails] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3001/api/support/categories")
            .then(response => setCategories(response.data))
            .catch(error => console.error("Lỗi khi tải danh mục hỗ trợ!", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/api/support/request", {
                customer_id: 1,
                category: categoryId,  // Gửi ID thay vì tên
                subject,
                details
            });
            setStatus("Yêu cầu của bạn đã được gửi thành công!");
        } catch (error) {
            setStatus("Lỗi khi gửi yêu cầu!");
        }
    };

    return (
        <div>
            <div className={styles.headerWrapper}>
                <Header />
            </div>
            <div className={styles.breadcrumb}>
                <Breadcrumb />
            </div>

            <div className={styles.supportContainer}>
                <h2 className={styles.supportTitle}>Gửi Yêu Cầu Hỗ Trợ</h2>
                {status && <p className={`${styles.supportMessage} ${status.includes("Lỗi") ? styles.errorMessage : styles.successMessage}`}>{status}</p>}

                <form onSubmit={handleSubmit} className={styles.supportForm}>
                    <label>Loại Yêu Cầu:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                        <option value="">Chọn loại yêu cầu</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <label>Tiêu đề:</label>
                    <input type="text" placeholder="Chủ đề" value={subject} onChange={(e) => setSubject(e.target.value)} required />

                    <label>Mô tả:</label>
                    <textarea rows="4" placeholder="Mô tả chi tiết vấn đề của bạn" value={details} onChange={(e) => setDetails(e.target.value)} required></textarea>

                    <button type="submit">Gửi Yêu Cầu</button>
                </form>
            </div>
        </div>
    );
};

export default SupportRequest;

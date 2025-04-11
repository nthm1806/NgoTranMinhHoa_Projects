import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumb.module.css";
import axios from "axios";

const categoryNames = {
    food: "Đặt Đồ Ăn & Đi Chợ",
    delivery: "Đặt Giao Hàng",
    promo: "Khuyến Mãi",
    payment: "Thanh Toán & Hoàn Tiền",
    account: "Tài Khoản",
    info: "Thông Tin Chung"
};

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const [itemTitle, setItemTitle] = useState("");
    const [userId, setUserId] = useState(null);

    // Lấy userId từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user?.id);
        }
    }, []);

    // Lấy tiêu đề của item nếu có
    useEffect(() => {
        const fetchItemTitle = async () => {
            const pathParts = location.pathname.split("/").filter((x) => x);

            if (pathParts[0] === "category" && pathParts.length === 3) {
                const categorySlug = pathParts[1];
                const itemId = pathParts[2];
                try {
                    const catRes = await axios.get("http://localhost:3001/api/categories");
                    const matchedCat = catRes.data.find((c) => c.link === `/category/${categorySlug}`);
                    if (!matchedCat) return;

                    const itemsRes = await axios.get(`http://localhost:3001/api/subitems/${matchedCat.id}`);
                    const matchedItem = itemsRes.data.find((item) => item.id.toString() === itemId);
                    if (matchedItem) setItemTitle(matchedItem.title);
                } catch (err) {
                    console.error("Lỗi lấy sub-item cho breadcrumb:", err);
                }
            }
        };

        fetchItemTitle();
    }, [location.pathname]);


    return (
        <nav className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            {" > "}
            <Link
                to={userId ? `/Portal/${userId}` : "/login"}
                className={styles.breadcrumbLink}
            >
                Hỗ trợ
            </Link>

            {pathnames[0] === "category" && (
                <>
                    {" > "}
                    <Link
                        to={`/category/${pathnames[1]}`}
                        className={styles.breadcrumbLink}
                    >
                        {categoryNames[pathnames[1]] || decodeURIComponent(pathnames[1])}
                    </Link>
                </>
            )}

            {pathnames.length === 3 && itemTitle && (
                <>
                    {" > "}
                    <span className={styles.current}>{itemTitle}</span>
                </>
            )}
        </nav>
    );
};

export default Breadcrumb;

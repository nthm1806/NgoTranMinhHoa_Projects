import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav className={styles.breadcrumb}>
            {/* Gốc luôn là Trang chủ > Portal */}
            <Link to="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            {" > "}
            <Link to="/portal" className={styles.breadcrumbLink}>Portal</Link>

            {/* Nếu có danh mục (category) */}
            {pathnames.length > 1 && pathnames[0] === "category" && (
                <>
                    {" > "}
                    <Link to={`/category/${pathnames[1]}`} className={styles.breadcrumbLink}>
                        {decodeURIComponent(pathnames[1])}
                    </Link>
                </>
            )}

            {/* Nếu có mục con (itemId) */}
            {pathnames.length > 2 && (
                <>
                    {" > "}
                    <span className={styles.current}>{decodeURIComponent(pathnames[2])}</span>
                </>
            )}
        </nav>
    );
};

export default Breadcrumb;

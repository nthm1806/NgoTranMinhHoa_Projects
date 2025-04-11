import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stylesProduct.module.css";
import { formatMoney } from "../../utils"; // Import hàm format tiền
import { LayoutCommon } from "../../layout/layout-common/LayoutCommon";

export const RecentProducts = () => {
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentProducts = () => {
            const storedProducts = JSON.parse(localStorage.getItem("recentProducts")) || [];
            setRecentProducts(storedProducts);
        };

        fetchRecentProducts();

        // Theo dõi thay đổi trong localStorage (nếu có cập nhật thì re-render)
        window.addEventListener("storage", fetchRecentProducts);
        return () => window.removeEventListener("storage", fetchRecentProducts);
    }, []);

    const handleClickProduct = (productID) => {
        navigate(`/product/${productID}`);
    };

    return (
        <LayoutCommon>
        <div className={styles.recent_container}>
            <h2 className={styles.recent_title}>Sản Phẩm Đã Xem Gần Đây</h2>
            <div className={styles.recent_list}>
                {recentProducts.length === 0 ? (
                    <p className={styles.no_recent}>Bạn chưa xem sản phẩm nào.</p>
                ) : (
                    recentProducts.map((product) => (
                        <div key={product.ProductID} className={styles.recent_item} onClick={() => handleClickProduct(product.ProductID)}>
                            <img className={styles.recent_image} src={product.ProductImg} alt={product.ProductName} />
                            <p className={styles.recent_name}>{product.ProductName}</p>
                            <p className={styles.recent_price}>{formatMoney(product.Price)} VND</p>
                        </div>
                    ))
                )}
            </div>
        </div>
        </LayoutCommon>
    );
};

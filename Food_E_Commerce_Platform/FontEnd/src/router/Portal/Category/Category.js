import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../layout/Header/Header";
import SearchBar from "../SearchBar/SearchBar";
import Footer from "../../../layout/Footer/Footer";
import styles from "./Category.module.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { ThemeContext } from "../../../contexts/ThemeContext"; // Import ThemeContext

function Category() {
    const { category, itemId } = useParams();
    const navigate = useNavigate();
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [subItems, setSubItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);

    // Lấy giá trị theme từ ThemeContext
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                // Fetch category data
                const { data } = await axios.get(`http://localhost:3001/api/categories`);
                const foundCategory = data.find((cat) => cat.link === `/category/${category}`);

                if (!foundCategory) {
                    setError("Danh mục không tồn tại");
                    return;
                }

                setCategoryDetails(foundCategory);

                // Fetch subItems for the selected category
                const subItemsData = await axios.get(`http://localhost:3001/api/subitems/${foundCategory.id}`);
                setSubItems(subItemsData.data);

                if (itemId) {
                    const foundItem = subItemsData.data.find((item) => item.id.toString() === itemId);
                    setSelectedItem(foundItem || null);
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu danh mục");
            }
        };

        fetchCategoryData();
    }, [category, itemId]);

    const handleItemClick = async (item) => {
        try {
            // Tăng view_count khi người dùng nhấp vào
            await axios.patch(`http://localhost:3001/api/subitems/increment/${item.id}`);

            setSelectedItem(item);
            navigate(`/category/${category}/${item.id}`);
        } catch (error) {
            console.error("Lỗi cập nhật view count:", error);
        }
    };

    // Xử lý lỗi nếu có
    if (error) return <p>{error}</p>;

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}>
            <div className={styles.headerWrapper}>
                <Header />
            </div>
            <Breadcrumb />
            <div className={styles.searchBanner}>
                <h1>Xin chào! Chúng tôi có thể giúp gì cho bạn?</h1>
                <SearchBar />
            </div>
            <div className={styles.categoryLayout}>
                <div className={styles.sidebar}>
                    <h2 className={`${styles.categoryTitle} ${theme === "dark" ? styles.darkText : ""}`}>
                        {categoryDetails?.name}
                    </h2>
                    <ul>
                        {subItems.map((item) => (
                            <li
                                key={item.id}
                                className={selectedItem?.id === item.id ? styles.active : ""}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.detailsPanel}>
                    {selectedItem ? (
                        <>
                            <h3 className={theme === "dark" ? styles.darkText : ""}>{selectedItem.title}</h3>
                            <p className={`${styles.detailsText} ${theme === "dark" ? styles.darkText : ""}`}>
                                {selectedItem.details}
                            </p>

                        </>
                    ) : (
                        <p className={theme === "dark" ? styles.darkText : ""}>Vui lòng chọn một mục để xem chi tiết.</p>
                    )}
                </div>
            </div>

            <div className={styles.headerWrapper}>
                <Footer />
            </div>
        </div>
    );
}

export default Category;

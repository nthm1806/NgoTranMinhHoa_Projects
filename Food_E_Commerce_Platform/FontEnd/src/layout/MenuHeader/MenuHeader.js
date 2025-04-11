import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../globalContext/GlobalContext"; // Import context
import { MenuHeaderContext } from "../../globalContext/MenuHeaderContext";
import { CustomerBehaviorContext } from "../../globalContext/CustomerBehaviorContext";
import styles from "./MenuHeader.module.css";
import { updateCart } from "../../service/cart";
import { useAuth } from "../../globalContext/AuthContext";
import axios from "axios";

function MenuHeader() {
  const { categoryList = [], productFavoriteList = [] } =
    useContext(GlobalContext); // Lấy dữ liệu từ context

  const { fetchAddCustomerBehavior } = useContext(CustomerBehaviorContext);

  const {
    productList = [],
    option,
    setOption,
    type,
    setType,
    menuDataLoaded,
    fetchProducts,
  } = useContext(MenuHeaderContext);

  const { customerID } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusAddCart, setStatusAddCart] = useState(false);
  const [hover, setHover] = useState(false);
  const [activeCategory, setActiveCategory] = useState(-1);
  const [activeType, setActiveType] = useState(0);

  const [deleteCategoryLove, setDeleteCategoryLove] = useState("");
  const [deleteProductIDTym, setDeleteProductIDTym] = useState("");
  const [activeDeleteTym, setActiveDeleteTym] = useState(false);
  const [favouriteProducts, setFavouriteProducts] = useState({});

  const [productIDTym, setProductIDTym] = useState("");
  const [categoryLove, setCategoryLove] = useState("");
  const [activeAddTym, setActiveAddTym] = useState(false);

  const fetchAddProductFavorite = async (
    productIDTym,
    categoryLove,
    customerID
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/ProductFavorite/AddProductIDTym",
        {
          productIDTym: productIDTym,
          categoryLove: categoryLove,
          customerID: customerID,
        }
      );

      console.log("Thêm sản phẩm yêu thích thành công:", response.data);

      // Cập nhật UI ngay lập tức
      setFavouriteProducts((prev) => ({
        ...prev,
        [productIDTym]: true, // Đánh dấu là yêu thích
      }));
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm yêu thích:", error);
    }
  };

  useEffect(() => {
    // Khi productFavoriteList thay đổi, đồng bộ lại trạng thái yêu thích
    const favoriteMap = {};
    productFavoriteList.forEach((fav) => {
      favoriteMap[fav.ProductID] = true; // Đánh dấu sản phẩm là yêu thích
    });
    setFavouriteProducts(favoriteMap);
  }, [productFavoriteList]);

  const fetchDeleteProductFavorite = async (
    deleteProductIDTym,
    deleteCategoryLove,
    customerID
  ) => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/ProductFavorite/DeleteProductIDTym",
        {
          params: {
            deleteProductIDTym,
            deleteCategoryLove,
            customerID,
          },
        }
      );

      console.log("✅ Xóa sản phẩm yêu thích thành công:", response.data);

      // Cập nhật lại trạng thái UI ngay sau khi xóa
      setFavouriteProducts((prev) => {
        const updatedFavorites = { ...prev };
        delete updatedFavorites[deleteProductIDTym]; // Xóa sản phẩm khỏi danh sách yêu thích
        return updatedFavorites;
      });
    } catch (error) {
      console.error(
        "❌ Lỗi khi xóa sản phẩm yêu thích:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (productIDTym && customerID) {
      fetchAddProductFavorite(productIDTym, categoryLove, customerID);
    }
  }, [productIDTym, customerID, activeAddTym]);

  useEffect(() => {
    if (deleteProductIDTym && customerID) {
      fetchDeleteProductFavorite(
        deleteProductIDTym,
        deleteCategoryLove,
        customerID
      );
    }
  }, [deleteProductIDTym, customerID, activeDeleteTym]);

  const handleAddToCart = async (item) => {
    try {
      setStatusAddCart(!statusAddCart);
      await updateCart({
        customerID: customerID,
        productID: item.ProductID,
        quantity: 1,
      });

      console.log("item: ", item);
    } catch (error) {
      console.error("error handleSetFavorite: ", error);
    }
  };

  return (
    <div className={styles.fhs_option_header}>
      {statusAddCart && customerID && (
        <div className={styles.popup_overlay}>
          <div className={styles.popup}>
            Thêm vào giỏ hàng thành công!
            <button
              className={styles.close_btn}
              onClick={() => setStatusAddCart(!statusAddCart)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Button mở menu */}
      <div
        className={styles.fhs_option_header_span}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onMouseLeave={() => {
          if (!isMenuOpen) setHover(false);
        }}
      >
        <img
          src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_menu.svg"
          alt=""
          style={{
            width: "36px",
            cursor: "pointer",
            borderBottom: hover || isMenuOpen ? "4px solid black" : "none",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        <img
          src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/icon_seemore_gray.svg"
          alt=""
          style={{
            cursor: "pointer",
            borderBottom: hover || isMenuOpen ? "4px solid black" : "none",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "12vh",
            left: "19.5vw",
            width: "60vw",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            zIndex: "100",
          }}
        >
          {/* Danh mục */}
          <div className={styles.option}>
            <div
              className={`${styles.items_option} ${
                activeCategory === -1 ? styles.active : ""
              }`}
              onClick={() => {
                setActiveCategory(-1);
                setOption("Tất Cả");
                fetchProducts("Tất Cả", type);
              }}
            >
              Tất Cả
            </div>
            {menuDataLoaded ? (
              categoryList.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.items_option} ${
                    activeCategory === index ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveCategory(index);
                    setOption(item.Category);
                    fetchProducts(item.Category, type);
                  }}
                >
                  {item.Category}
                </div>
              ))
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>

          {/* Loại sản phẩm */}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className={styles.type}>
              {["Mới Nhất", "Rẻ Nhất", "Đắt Nhất", "Bán Chạy Nhất"].map(
                (label, index) => (
                  <div
                    key={index}
                    className={`${styles.items_type} ${
                      activeType === index ? styles.active : ""
                    }`}
                    onClick={() => {
                      setActiveType(index);
                      setType(label);
                      fetchProducts(option, label);
                    }}
                  >
                    {label}
                  </div>
                )
              )}
            </div>

            {/* Hiển thị sản phẩm */}
            <div className={styles.showProducts}>
              {productList.length > 0 ? (
                productList.map((item, index) => (
                  <div
                    onClick={() =>
                      fetchAddCustomerBehavior(
                        customerID,
                        item.ProductID,
                        item.Category,
                        "view",
                        item.ShopID
                      )
                    }
                    key={index}
                    className={styles.items_showProducts}
                  >
                    <img className={styles.img} src={item.ProductImg} alt="" />
                    <p style={{ marginBottom: "0.2vw", marginTop: "0" }}>
                      {item.ProductName}
                    </p>
                    <div
                      style={{
                        color: "red",
                        marginBottom: "0.2vw",
                        height: "2vw",
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "1vw",
                        fontWeight: "bold",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          position: "absolute",
                          left: "-4.3vw",
                          padding: "0.2vw",
                          fontSize: "0.5vw",
                        }}
                      >
                        Add To Cart
                      </button>
                      {Number(item.Price).toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                      <span
                        onClick={() => {
                          if (favouriteProducts[item.ProductID]) {
                            // Nếu đã yêu thích, xóa khỏi danh sách
                            setDeleteCategoryLove(item.Category);
                            setDeleteProductIDTym(item.ProductID);
                            setActiveDeleteTym(!activeDeleteTym);
                          } else {
                            // Nếu chưa yêu thích, thêm vào danh sách
                            setProductIDTym(item.ProductID);
                            setCategoryLove(item.Category);
                            setActiveAddTym(!activeAddTym);
                          }
                        }}
                      >
                        {favouriteProducts[item.ProductID] ? (
                          <img
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "-4.5vw",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "2vw",
                              height: "1.5vw",
                            }}
                            src="/tym_do.png"
                            alt="Yêu thích"
                          />
                        ) : (
                          <img
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "-4vw",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "1vw",
                              height: "1vw",
                            }}
                            src="/tym.png"
                            alt="Chưa yêu thích"
                          />
                        )}
                      </span>
                    </div>
                    {item.Category === "Đồ Tươi Sống" && (
                      <div style={{ paddingBottom: "0.5vh" }}>
                        Khối Lượng:
                        <span
                          style={{
                            marginLeft: "0.5vw",
                            color: "Green",
                            fontWeight: "500",
                          }}
                        >
                          {item.Weight} g
                        </span>{" "}
                      </div>
                    )}
                    <div>
                      Đã bán:{" "}
                      <span style={{ marginLeft: "0.5vw", color: "blue" }}>
                        {item.SoldQuantity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuHeader;

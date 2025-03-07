import { useState, useContext, useEffect } from "react";
import styles from "./Main.module.css";
import { GlobalContext } from "../../globalContext/GlobalContext";
import axios from "axios";
import { useAuth } from "../../globalContext/AuthContext";
import { useNavigate } from "react-router";

function Main() {
  let navigate = useNavigate();
  const {
    categoryList,
    setOptionMain,
    optionMain,
    productListMain,
    loading,
    productFavoriteList = [],
  } = useContext(GlobalContext);

  const { customerID } = useAuth() || {};

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

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Hiển thị 8 sản phẩm mỗi trang

  // Tính toán số trang
  const totalPages = Math.ceil(
    (productListMain?.length || 0) / productsPerPage
  );

  // Cắt danh sách sản phẩm để hiển thị trang hiện tại
  const currentProducts =
    productListMain?.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    ) || [];

  const products = [
    {
      id: 1,
      name: "Sườn Nướng Ngũ Vị",
      price: "250.000 ",
      img: "suon-nuong.jpg",
    },
    { id: 2, name: "Bánh Sô-cô-la", price: "59.000 ", img: "banh-socola.jpg" },
    { id: 3, name: "Nấm Kho Tiêu", price: "65.274 ", img: "nam-kho.jpg" },
    {
      id: 4,
      name: "Cua Hoàng Đế",
      price: "1.200.000 ",
      img: "cua-hoang-de.jpg",
    },
    { id: 5, name: "Chân Gà Nướng", price: "120.000 ", img: "chan-ga.jpg" },
    { id: 6, name: "Sinh Tố Dâu", price: "45.940 ", img: "sinh-to-dau.jpg" },
    { id: 7, name: "Lẩu Ếch Măng Cay", price: "295.000 ", img: "lau-ech.jpg" },
    { id: 8, name: "Cà Phê Sữa Đá", price: "30.000 ", img: "ca-phe-sua.jpg" },
  ];

  return (
    <div className={styles.block_main}>
      <div className={styles.bar_one}>Deal Hôm Nay</div>
      <div style={{ background: "white" }} className={styles.showProducts}>
        {products.map((item, index) => (
          <div
            key={index}
            style={{
              marginLeft: "0.7vw",
              marginTop: "2vh",
              background: "#eee",
            }}
            className={styles.items_showProducts}
          >
            <img
              className={styles.img}
              src={item.ProductImg}
              alt={item.ProductName}
            />
            <p style={{ marginBottom: "0.2vw", marginTop: "0" }}>{item.name}</p>
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
              {Number(item.price).toLocaleString("vi-VI", {
                style: "currency",
                currency: "VND",
              })}{" "}
              <span
                onClick={() => {
                  if (favouriteProducts[item.id]) {
                    // Nếu đã yêu thích, xóa khỏi danh sách
                    setDeleteCategoryLove(item.Category);
                    setDeleteProductIDTym(item.id);
                    setActiveDeleteTym(!activeDeleteTym);
                  } else {
                    // Nếu chưa yêu thích, thêm vào danh sách
                    setProductIDTym(item.id);
                    setCategoryLove(item.Category);
                    setActiveAddTym(!activeAddTym);
                  }
                }}
              >
                {favouriteProducts[item.id] ? (
                  <img
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "-4vw",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "2.5vw",
                      height: "2vw",
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
            <div>
              =&gt; Đã bán: <span style={{ color: "blue" }}>15</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.wrapper}>
        {/* Category Options */}
        <div className={styles.options}>
          <div
            className={`${styles.items_options} ${
              optionMain === "Tất Cả" ? styles.active : ""
            }`}
            onClick={() => {
              setOptionMain("Tất Cả");
              setCurrentPage(1);
            }}
          >
            Tất Cả
          </div>
          {Array.isArray(categoryList) && categoryList.length > 0 ? (
            categoryList.map((item, index) => (
              <div
                key={index}
                className={`${styles.items_options} ${
                  optionMain === item.Category ? styles.active : ""
                }`}
                onClick={() => {
                  setOptionMain(item.Category);
                  setCurrentPage(1);
                }}
              >
                {item.Category}
              </div>
            ))
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>

        {/* Product List */}
        <div className={styles.showProducts}>
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : currentProducts.length > 0 ? (
            currentProducts.map((item, index) => (
              <div key={index} className={styles.items_showProducts}>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${item.ProductID}`)}
                  className={styles.img}
                  src={item.ProductImg}
                  alt={item.ProductName}
                />
                <p
                  onClick={() => navigate(`/product/${item.ProductID}`)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "0.2vw",
                    marginTop: "0",
                  }}
                >
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
                  {Number(item.Price).toLocaleString("vi-VI", {
                    style: "currency",
                    currency: "VND",
                  })}
                  <span
                    onClick={() => {
                      if (favouriteProducts[item.ProductID]) {
                        setDeleteCategoryLove(item.Category);
                        setDeleteProductIDTym(item.ProductID);
                        setActiveDeleteTym(!activeDeleteTym);
                      } else {
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
                          right: "-4vw",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "2.5vw",
                          height: "2vw",
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
                  =&gt; Đã bán:
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;&lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`${styles.pageButton} ${
                  currentPage === index + 1 ? styles.activePage : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={styles.pageButton}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;

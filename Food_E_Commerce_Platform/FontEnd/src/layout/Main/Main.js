import { useState, useContext, useEffect } from "react";
import styles from "./Main.module.css";
import { GlobalContext } from "../../globalContext/GlobalContext";
import { CustomerBehaviorContext } from "../../globalContext/CustomerBehaviorContext";
import axios from "axios";
import { useAuth } from "../../globalContext/AuthContext";
import { ShopContext } from "../../globalContext/ShopContext";
import { useNavigate } from "react-router";
import { updateCart } from "../../service/cart";
import { useCart } from "../../globalContext/CartContext";
import ReactPlayer from "react-player";

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

  const { followedShopsProducts = [], behaviorCustomerProducts = [] } =
    useContext(ShopContext);

  const { fetchAddCustomerBehavior } = useContext(CustomerBehaviorContext);

  const { customerID } = useAuth() || {};
  const { fetchCartCount } = useCart();
  const [deleteCategoryLove, setDeleteCategoryLove] = useState("");
  const [deleteProductIDTym, setDeleteProductIDTym] = useState("");
  const [activeDeleteTym, setActiveDeleteTym] = useState(false);
  const [statusAddCart, setStatusAddCart] = useState(false);
  const [favouriteProducts, setFavouriteProducts] = useState({});
  const [productIDTym, setProductIDTym] = useState("");
  const [categoryLove, setCategoryLove] = useState("");
  const [activeAddTym, setActiveAddTym] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const itemsPerPage = 8;

  // Để điều khiển trang sản phẩm các shop theo dõi
  const [currentPageSuggestShopFollowed, setCurrentPageSuggestShopFollowed] =
    useState(1);
  // Đổi tên các biến liên quan đến việc chuyển trang cho phần "Sở Thích"
  const [currentPageSuggestBehavior, setCurrentPageSuggestBehavior] =
    useState(1); // Giữ logic giống nhưng đổi tên

  const prevPageSuggestBehavior = () => {
    if (currentPageSuggestBehavior > 1) {
      setCurrentPageSuggestBehavior(currentPageSuggestBehavior - 1);
    } else {
      setCurrentPageSuggestBehavior(totalPagesSuggestBehavior);
    }
  };

  const nextPageSuggestBehavior = () => {
    if (currentPageSuggestBehavior < totalPagesSuggestBehavior) {
      setCurrentPageSuggestBehavior(currentPageSuggestBehavior + 1);
    } else {
      setCurrentPageSuggestBehavior(1);
    }
  };

  // Tính tổng số trang cho phần "Gợi Ý Sản Phẩm Theo Sở Thích"
  const totalPagesSuggestBehavior = Math.ceil(
    behaviorCustomerProducts?.length / itemsPerPage
  );

  const currentProductsSuggestBehavior =
    behaviorCustomerProducts?.slice(
      (currentPageSuggestBehavior - 1) * itemsPerPage,
      currentPageSuggestBehavior * itemsPerPage
    ) || [];

  const totalPagesSuggestShopFollowed = Math.ceil(
    followedShopsProducts.length / itemsPerPage
  );

  const currentProductsSuggestShopFollowed =
    followedShopsProducts?.slice(
      (currentPageSuggestShopFollowed - 1) * itemsPerPage,
      currentPageSuggestShopFollowed * itemsPerPage
    ) || [];
  // Chỉnh sửa hàm prevPage và nextPage cho các shop đã theo dõi
  const prevPageSuggestShopFollowed = () => {
    if (currentPageSuggestShopFollowed > 1) {
      setCurrentPageSuggestShopFollowed(currentPageSuggestShopFollowed - 1);
    } else {
      setCurrentPageSuggestShopFollowed(totalPagesSuggestShopFollowed);
    }
  };

  const nextPageSuggestShopFollowed = () => {
    if (currentPageSuggestShopFollowed < totalPagesSuggestShopFollowed) {
      setCurrentPageSuggestShopFollowed(currentPageSuggestShopFollowed + 1);
    } else {
      setCurrentPageSuggestShopFollowed(1);
    }
  };
  useEffect(() => {
    fetchVideo();
  }, []);
  async function fetchVideo() {
    const res = await axios.post("http://localhost:3001/api/Video/getVideo");
    setVideoList(res.data);
    console.log(res.data);
  }
  async function hanldeVideo(id){
    navigate(`/video/${id}`)
  }
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

  const handleAddToCart = async (item) => {
    try {
      setStatusAddCart(!statusAddCart);
      await updateCart({
        customerID: customerID,
        productID: item.ProductID,
        quantity: 1,
      });

      await fetchCartCount();
      setStatusAddCart(true);

      console.log("item: ", item);
    } catch (error) {
      console.error("error handleSetFavorite: ", error);
    }
  };
  return (
    <div className={styles.block_main}>
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
      {customerID && (
        <>
          <div className={styles.bar_one}>
            Gợi Ý Sản Phẩm Các Shop
            {/* Nút chuyển trang các shop đã theo dõi */}
            <div
              style={{
                position: "absolute",
                right: "0vw",
                width: "18vw",
                justifyContent: "space-between",
              }}
            >
              <button
                style={{ top: "-5vh", padding: "0.2vw", fontSize: "1vw" }}
                onClick={prevPageSuggestShopFollowed}
              >
                Trước
              </button>
              <span>
                Trang {currentPageSuggestShopFollowed} /{" "}
                <span
                  style={{
                    color: "red",
                    marginLeft: "0.1vw",
                    marginRight: "1vw",
                  }}
                >
                  {totalPagesSuggestShopFollowed}
                </span>
              </span>
              <button
                style={{ padding: "0.2vw", fontSize: "1vw" }}
                onClick={nextPageSuggestShopFollowed}
              >
                Sau
              </button>
            </div>
          </div>
          <div
            style={{ background: "white", display: "flex" }}
            className={styles.showProducts}
          >
            <button
              style={{
                position: "absolute",
                top: "55vh",
                right: "5vw",
                padding: "0.5vw",
                borderRadius: "30%",
              }}
              onClick={nextPageSuggestShopFollowed}
            >
              &gt;&gt;
            </button>
            <button
              style={{
                position: "absolute",
                top: "55vh",
                left: "5vw",
                padding: "0.5vw",
                borderRadius: "30%",
              }}
              onClick={prevPageSuggestShopFollowed}
            >
              &lt;&lt;
            </button>

            {currentProductsSuggestShopFollowed.map((item, index) => (
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
                style={{
                  marginLeft: "1vw",
                  marginTop: "2vh",
                  background: "#eee",
                }}
                className={styles.items_showProducts}
              >
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
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      position: "absolute",
                      left: "-6vw",
                      padding: "0.2vw",
                      fontSize: "0.7vw",
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
                          right: "-5.5vw",
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
                          right: "-5vw",
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
                  <span style={{ color: "blue" }}>{item.SoldQuantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.bar_one}>
            Gợi Ý Sản Phẩm Theo Sở Thích
            {/* Nút chuyển trang các shop đã theo dõi */}
            <div
              style={{
                position: "absolute",
                right: "0vw",
                width: "18vw",
                justifyContent: "space-between",
              }}
            >
              <button
                style={{ padding: "0.2vw", fontSize: "1vw" }}
                onClick={prevPageSuggestBehavior}
              >
                Trước
              </button>
              <span>
                Trang {currentPageSuggestBehavior} /{" "}
                <span
                  style={{
                    color: "red",
                    marginLeft: "0.1vw",
                    marginRight: "1vw",
                  }}
                >
                  {totalPagesSuggestBehavior}
                </span>
              </span>
              <button
                style={{ padding: "0.2vw", fontSize: "1vw" }}
                onClick={nextPageSuggestBehavior}
              >
                Sau
              </button>
            </div>
          </div>
          <div
            style={{ background: "white", display: "flex" }}
            className={styles.showProducts}
          >
            <button
              style={{
                position: "absolute",
                top: "145vh",
                right: "5vw",
                padding: "0.5vw",
                borderRadius: "30%",
              }}
              onClick={nextPageSuggestBehavior}
            >
              &gt;&gt;
            </button>
            <button
              style={{
                position: "absolute",
                top: "145vh",
                left: "5vw",
                padding: "0.5vw",
                borderRadius: "30%",
              }}
              onClick={prevPageSuggestBehavior}
            >
              &lt;&lt;
            </button>
            {currentProductsSuggestBehavior.map((item, index) => (
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
                style={{
                  marginLeft: "1vw",
                  marginTop: "2vh",
                  background: "#eee",
                }}
                className={styles.items_showProducts}
              >
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
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      position: "absolute",
                      left: "-6vw",
                      padding: "0.2vw",
                      fontSize: "0.7vw",
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
                          right: "-5.5vw",
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
                          right: "-5vw",
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
                  <span style={{ color: "blue" }}>{item.SoldQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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
                style={{ width: "19vw" }}
                className={styles.items_showProducts}
              >
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
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      position: "absolute",
                      left: "-6vw",
                      padding: "0.2vw",
                      fontSize: "0.7vw",
                    }}
                  >
                    Add To Cart
                  </button>
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
                          right: "-5.5vw",
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
                          right: "-5vw",
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
                  Đã bán:
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
      <div>
        <h3>Các video phổ biến</h3>
        <div className={styles.videoContainer}>
          {videoList.length > 0 &&
            videoList.map((item) => (
              <div className={styles.video} onClick={() => hanldeVideo(item.VideoID)}>
                <ReactPlayer
                  url={item.VideoUrl}
                  loop
                  muted
                  playing
                  height="35.5vw"
                  width="20vw"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Main;

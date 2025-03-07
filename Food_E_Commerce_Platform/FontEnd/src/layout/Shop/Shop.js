import styles from "./Shop.module.css";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../globalContext/GlobalContext";
import { useAuth } from "../../globalContext/AuthContext";
import { ShopContext } from "../../globalContext/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router";

function Shop() {
  let navigate = useNavigate();
  const {
    shopID,
    inforShopList,
    voucherShopList,
    productShopSuggestList,
    categoryProductByShopID,
    productFavoriteList = [],
    listVoucherByCustomerID = [],
    listCustomerShopFollow = [],
  } = useContext(GlobalContext);

  const { productShopList, setTypeCategory, setOptionProductShop } =
    useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Giá");
  const [activeButton, setActiveButton] = useState("Phổ Biến");
  const [favouriteProducts, setFavouriteProducts] = useState({});
  const [productIDTym, setProductIDTym] = useState("");
  const [categoryLove, setCategoryLove] = useState("");
  const [deleteProductIDTym, setDeleteProductIDTym] = useState("");
  const [deleteCategoryLove, setDeleteCategoryLove] = useState("");
  const [activeAddTym, setActiveAddTym] = useState(false);
  const [activeDeleteTym, setActiveDeleteTym] = useState(false);
  const { customerID } = useAuth() || {};

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Hiển thị 8 sản phẩm mỗi trang

  // Tính toán số trang
  const totalPages = Math.ceil(
    (productShopList?.length || 0) / productsPerPage
  );

  // Cắt danh sách sản phẩm để hiển thị trang hiện tại
  const currentProducts =
    productShopList?.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    ) || [];

  const handleSortButtonClick = (option) => {
    setActiveButton(option);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusFollow, setStatusFollow] = useState(false);
  const [statusDeleteFollow, setStatusDeleteFollow] = useState(false);
  const [changeStatusFollow, setChangeStatusFollow] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState({});
  const [saveVoucherID, setSaveVoucherID] = useState(null);
  const [deleteVoucherID, setDeleteVoucherID] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexSuggest, setCurrentIndexSuggest] = useState(0);
  const visibleItems = 3;
  const visibleItemsSuggest = 5;

  // Xử lý chuyển trang
  const nextVouchers = () => {
    if (currentIndex + visibleItems < voucherShopList.length) {
      setCurrentIndex(currentIndex + visibleItems);
    }
  };

  const prevVouchers = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - visibleItems);
    }
  };

  const prevSuggest = () => {
    setCurrentIndexSuggest((prevIndex) =>
      prevIndex - visibleItemsSuggest >= 0
        ? prevIndex - visibleItemsSuggest
        : productShopSuggestList.length -
          (productShopSuggestList.length % visibleItemsSuggest ||
            visibleItemsSuggest)
    );
  };

  const nextSuggest = () => {
    setCurrentIndexSuggest((prevIndex) =>
      prevIndex + visibleItemsSuggest < productShopSuggestList.length
        ? prevIndex + visibleItemsSuggest
        : 0
    );
  };

  // ADD Customer follow shop
  const fetchAddCustomerShopFollow = async (shopID, customerID) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/CustomerShopFollow/AddCustomerShopFollow",
        {
          shopID: shopID,
          customerID: customerID,
        }
      );

      console.log("Thêm follow thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm follow:", error);
    }
  };

  useEffect(() => {
    if (customerID && shopID && statusFollow) {
      fetchAddCustomerShopFollow(shopID, customerID);
    }
  }, [customerID, shopID, statusFollow]);

  //Xóa Customer follow shop
  const fetchDeleteCustomerShopFollow = async (shopID, customerID) => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/CustomerShopFollow/DeleteCustomerShopFollow",
        {
          params: {
            shopID: shopID,
            customerID: customerID,
          },
        }
      );

      console.log("Xóa follow thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi Xóa follow:", error);
    }
  };

  useEffect(() => {
    if (customerID && shopID && statusDeleteFollow) {
      fetchDeleteCustomerShopFollow(shopID, customerID);
    }
  }, [customerID, shopID, statusDeleteFollow]);

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
  //Lưu Voucher của shop mà Customer nhậnnhận
  const fetchSaveVoucherID = async (saveVoucherID, customerID) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/VoucherDetail/SaveVoucherID",
        {
          saveVoucherID: saveVoucherID,
          customerID: customerID,
        }
      );

      console.log("✅ Thêm voucher thành công:", response.data);

      // Cập nhật UI ngay lập tức
      setSavedVouchers((prev) => ({
        ...prev,
        [saveVoucherID]: true, // Đánh dấu voucher là đã lưu
      }));
    } catch (error) {
      console.error("❌ Lỗi khi thêm Voucher:", error);
    }
  };

  const fetchDeleteVoucherID = async (deleteVoucherID, customerID) => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/VoucherDetail/DeleteVoucherID",
        {
          params: {
            deleteVoucherID: deleteVoucherID,
            customerID: customerID,
          },
        }
      );

      console.log("✅ Xóa voucher thành công:", response.data);

      // Cập nhật lại trạng thái UI ngay sau khi xóa
      setSavedVouchers((prev) => {
        const updatedVouchers = { ...prev };
        delete updatedVouchers[deleteVoucherID]; // Xóa voucher khỏi danh sách đã lưu
        return updatedVouchers;
      });
    } catch (error) {
      console.error("❌ Lỗi khi xóa Voucher:", error);
    }
  };

  useEffect(() => {
    // Khi listVoucherByCustomerID thay đổi, đồng bộ lại trạng thái đã lưu
    const voucherMap = {};
    listVoucherByCustomerID.forEach((voucher) => {
      voucherMap[voucher.VoucherID] = true; // Đánh dấu voucher là đã lưu
    });
    setSavedVouchers(voucherMap);
  }, [listVoucherByCustomerID]);

  useEffect(() => {
    if (deleteVoucherID && customerID) {
      fetchDeleteVoucherID(deleteVoucherID, customerID);
    }
  }, [deleteVoucherID, customerID]);

  useEffect(() => {
    if (saveVoucherID && customerID) {
      fetchSaveVoucherID(saveVoucherID, customerID);
    }
  }, [saveVoucherID, customerID]);

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

  const isFollowing = listCustomerShopFollow.some(
    (item) =>
      String(item.CustomerID) === String(customerID) &&
      String(item.ShopID) === String(shopID)
  );

  // Sử dụng useEffect để cập nhật trạng thái khi `isFollowing` thay đổi
  useEffect(() => {
    if (isFollowing) {
      setChangeStatusFollow(true);
    } else {
      setChangeStatusFollow(false);
    }
  }, [isFollowing]);

  return (
    <>
      <div className={styles.block_one}>
        <div style={{ width: "25vw", height: "15vh", position: "relative" }}>
          <img
            style={{ width: "25vw", height: "15vh" }}
            src={inforShopList.Background}
            alt=""
          />
          <img
            style={{
              width: "8vw",
              height: "8vh",
              borderRadius: "50%",
              position: "absolute",
              left: "1vw",
              top: "1.5vh",
            }}
            src={inforShopList.ShopAvatar}
            alt=""
          />
          {changeStatusFollow ? (
            <button
              style={{
                width: "11vw",
                height: "1vh",
                borderRadius: "5px",
                position: "absolute",
                left: "0.5vw",
                top: "10vh",
                fontSize: "0.8vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                setStatusDeleteFollow(!statusDeleteFollow);
                setChangeStatusFollow(!changeStatusFollow);
              }}
            >
              ✅ Đang Theo Dõi
            </button>
          ) : (
            <button
              style={{
                width: "11vw",
                height: "1vh",
                borderRadius: "5px",
                position: "absolute",
                left: "0.5vw",
                top: "10vh",
                fontSize: "0.8vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                setStatusFollow(!statusFollow);
                setChangeStatusFollow(!changeStatusFollow);
              }}
            >
              + Theo Dõi
            </button>
          )}

          <button
            style={{
              width: "11vw",
              height: "1vh",
              borderRadius: "5px",
              position: "absolute",
              left: "13vw",
              top: "10vh",
              fontSize: "0.8vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ... Chat
          </button>
        </div>
        <div className={styles.block_one_2}>
          <div className={styles.item}>
            Sản Phẩm:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {inforShopList.total_products}
            </span>
          </div>
          <div className={styles.item}>
            Đang Theo:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {statusFollow
                ? inforShopList.following + 1
                : inforShopList.following}
            </span>
          </div>
          <div className={styles.item}>
            Tỉ lệ phản hồi Chat:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {inforShopList.response_rate}
              {"%"}({inforShopList.response_time})
            </span>
          </div>
          <div className={styles.item}>
            Người theo dõi:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {inforShopList.total_products}
            </span>
          </div>
          <div className={styles.item}>
            Đánh Giá:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {inforShopList.total_products}
            </span>
          </div>
          <div className={styles.item}>
            Tham gia:{" "}
            <span style={{ color: "red", marginLeft: "1vw" }}>
              {new Date(inforShopList.join_date).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}{" "}
            </span>
          </div>
        </div>
      </div>

      <div
        className={styles.block_two}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {voucherShopList.length > visibleItems && (
          <button
            style={{
              position: "absolute",
              left: "-1.5vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={prevVouchers}
          >
            &lt;
          </button>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1vw",
          }}
        >
          {voucherShopList
            .slice(currentIndex, currentIndex + visibleItems)
            .map((item, index) => (
              <div key={index} className={styles.block_item_voucher}>
                <div style={{ marginTop: "3.5vh" }}>{item.VoucherTitle}</div>
                <div>{item.VoucherName}</div>
                <div>
                  EndDate:{" "}
                  {new Date(item.EndDate).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </div>
                <button
                  onClick={() => {
                    if (savedVouchers[item.VoucherID]) {
                      // Nếu đã lưu, xóa khỏi danh sách
                      setDeleteVoucherID(item.VoucherID);
                    } else {
                      // Nếu chưa lưu, thêm vào danh sách
                      setSaveVoucherID(item.VoucherID);
                    }
                  }}
                  style={{
                    position: "absolute",
                    right: "1vw",
                    top: "0.01vh",
                    fontSize: "1vw",
                    padding: "0.4vw",
                  }}
                >
                  {savedVouchers[item.VoucherID] ? "✅ Đã Lưu" : "Lưu"}
                </button>
              </div>
            ))}
        </div>

        {voucherShopList.length > visibleItems && (
          <button
            style={{
              position: "absolute",
              right: "-1.5vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={nextVouchers}
            disabled={currentIndex + visibleItems >= voucherShopList.length}
          >
            &gt;
          </button>
        )}
      </div>
      <div className={styles.block_three}>
        <div
          style={{
            padding: "1vw",
            fontSize: "1.5vw",
            fontWeight: "500",
            color: "red",
          }}
        >
          {" "}
          Gợi Ý Cho Bạn <span style={{ color: "red" }}>(10 Sản Phẩm)</span>
        </div>
        {/* Hiển thị sản phẩm */}
        <div
          className={styles.showProducts}
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <button
            style={{
              position: "absolute",
              left: "-2.3vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={prevSuggest}
          >
            &lt;
          </button>
          {productShopSuggestList.length > 0 ? (
            productShopSuggestList
              .slice(
                currentIndexSuggest,
                currentIndexSuggest + visibleItemsSuggest
              )
              .map((item, index) => (
                <div key={index} className={styles.items_showProducts}>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.ProductID}`)}
                    className={styles.img}
                    src={item.ProductImg}
                    alt=""
                  />
                  <p
                    onClick={() => navigate(`/product/${item.ProductID}`)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "2vh",
                      marginTop: "0",
                    }}
                  >
                    {item.ProductName}
                  </p>
                  <div
                    style={{
                      color: "red",
                      marginBottom: "1.5vh",
                      height: "1.7vw",
                      display: "flex",
                      flexDirection: "row",
                      position: "relative",
                    }}
                  >
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
                    =&gt; Đã bán:{" "}
                    <span style={{ color: "blue" }}>{item.SoldQuantity}</span>
                  </div>
                </div>
              ))
          ) : (
            <p>Không có dữ liệu</p>
          )}
          <button
            style={{
              position: "absolute",
              right: "-2.3vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={nextSuggest}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className={styles.block_three}>
        <div
          style={{
            padding: "1vw",
            fontSize: "1.5vw",
            fontWeight: "500",
            color: "red",
          }}
        >
          {" "}
          Sản Phẩm Bán Chạy Nhất{" "}
          <span style={{ color: "red" }}>(10 Sản Phẩm)</span>
        </div>
        {/* Hiển thị sản phẩm */}
        <div
          className={styles.showProducts}
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <button
            style={{
              position: "absolute",
              left: "-2.3vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={prevSuggest}
          >
            &lt;
          </button>
          {productShopSuggestList.length > 0 ? (
            productShopSuggestList
              .slice(
                currentIndexSuggest,
                currentIndexSuggest + visibleItemsSuggest
              )
              .map((item, index) => (
                <div key={index} className={styles.items_showProducts}>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.ProductID}`)}
                    className={styles.img}
                    src={item.ProductImg}
                    alt=""
                  />
                  <p
                    onClick={() => navigate(`/product/${item.ProductID}`)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "2vh",
                      marginTop: "0",
                    }}
                  >
                    {item.ProductName}
                  </p>
                  <div
                    style={{
                      color: "red",
                      marginBottom: "1.5vh",
                      height: "1.7vw",
                      display: "flex",
                      flexDirection: "row",
                      position: "relative",
                    }}
                  >
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
                    =&gt; Đã bán:{" "}
                    <span style={{ color: "blue" }}>{item.SoldQuantity}</span>
                  </div>
                </div>
              ))
          ) : (
            <p>Không có dữ liệu</p>
          )}
          <button
            style={{
              position: "absolute",
              right: "-2.3vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: "10",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={nextSuggest}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className={styles.block_four}>
        <div className={styles.block_sidebar_shop}>
          <div
            style={{
              padding: "2vh 1vw",
              borderBottom: "1px solid black",
              fontSize: "1.3vw",
              fontWeight: "600",
            }}
          >
            Danh Mục
          </div>
          {categoryProductByShopID.map((itemCategory, index) => (
            <div
              onClick={() => {
                setActiveIndex(index);
                setTypeCategory(itemCategory.Category);
              }}
              className={`${styles.categoryItem} ${
                activeIndex === index ? styles.active : ""
              }`}
              key={index}
            >
              {itemCategory.Category}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "65vw",
              height: "8vh",
              flexDirection: "row",
            }}
          >
            <span>
              <span style={{ marginLeft: "0vw", marginRight: "1vw" }}>
                Sắp Xếp Theo
              </span>
              <button
                style={{ border: "none" }}
                className={
                  activeButton === "Phổ Biến" ? styles.activeButton : ""
                }
                onClick={() => {
                  handleSortButtonClick("Phổ Biến");
                  setOptionProductShop("Phổ Biến");
                }}
              >
                Phổ Biến
              </button>
              <button
                style={{ border: "none" }}
                className={
                  activeButton === "Mới Nhất" ? styles.activeButton : ""
                }
                onClick={() => {
                  handleSortButtonClick("Mới Nhất");
                  setOptionProductShop("Mới Nhất");
                }}
              >
                Mới Nhất
              </button>
              <button
                style={{ border: "none" }}
                className={
                  activeButton === "Bán Chạy" ? styles.activeButton : ""
                }
                onClick={() => {
                  handleSortButtonClick("Bán Chạy");
                  setOptionProductShop("Bán Chạy");
                }}
              >
                Bán Chạy
              </button>
              <span>
                <button
                  className={
                    ["Giá", "Giá: Thấp đến Cao", "Giá: Cao đến Thấp"].includes(
                      activeButton
                    )
                      ? styles.activeButton
                      : ""
                  }
                  style={{ marginLeft: "-1vw", width: "17vw", border: "none" }}
                  onClick={() => {
                    setIsOpen(!isOpen);
                    handleSortButtonClick("Giá");
                  }}
                >
                  {selected} <span>▼</span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      zIndex: "10",
                      width: "15vw",
                      position: "absolute",
                      left: "33.5vw",
                    }}
                  >
                    <button
                      style={{ border: "none" }}
                      onClick={() => {
                        handleSelect("Giá: Thấp đến Cao");
                        handleSortButtonClick("Giá: Thấp đến Cao");
                        setOptionProductShop("Giá: Thấp đến Cao");
                      }}
                      className={
                        [
                          "Giá",
                          "Giá: Thấp đến Cao",
                          "Giá: Cao đến Thấp",
                        ].includes(activeButton)
                          ? styles.activeButton
                          : ""
                      }
                    >
                      Giá: Thấp đến Cao
                    </button>
                    <button
                      style={{ border: "none" }}
                      onClick={() => {
                        handleSelect("Giá: Cao đến Thấp");
                        handleSortButtonClick("Giá: Cao đến Thấp");
                        setOptionProductShop("Giá: Cao đến Thấp");
                      }}
                      className={
                        [
                          "Giá",
                          "Giá: Thấp đến Cao",
                          "Giá: Cao đến Thấp",
                        ].includes(activeButton)
                          ? styles.activeButton
                          : ""
                      }
                    >
                      Giá: Cao đến Thấp
                    </button>
                  </div>
                )}
              </span>

              <span style={{ marginLeft: "4.8vw" }}>
                {currentPage}
                <span style={{ marginLeft: "0.2vw", color: "red" }}>
                  / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </span>
            </span>
          </div>
          <div className={styles.showProducts_Shop}>
            {currentProducts.length > 0 ? (
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
                      marginBottom: "0.2vw",
                      marginTop: "0",
                      cursor: "pointer",
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
                      Khối Lượng:{" "}
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
                    =&gt; Đã bán:{" "}
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
          {/* Chuyển trang */}
          {totalPages > 0 && (
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
    </>
  );
}

export default Shop;

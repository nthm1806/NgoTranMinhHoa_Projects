import React, { useState, useEffect, useContext } from "react";
import styles from "./ViewOrder.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../globalContext/GlobalContext";

function ViewOrder() {
  const navigate = useNavigate();
  const { setShopID } = useContext(GlobalContext);
  const customer = JSON.parse(localStorage.getItem("user"));
  const [allOrder, setAllOrder] = useState([]);
  const [chooseStatus, setChooseStatus] = useState("Tất cả");
  const [orderList, setOrderList] = useState([]);
  const [reviewPopup, setReviewPopup] = useState(null);
  const [messPopup, setMessPopup] = useState(null);
  const [chooseQuantity, setChooseQuantity] = useState(null);
  const [buyOrder, setBuyOrder] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [indexList, setIndexList] = useState(0);
  const [orderBuyAgain, setOrderBuyAgain] = useState();
  const [fillRatring, setFillRating] = useState(false);
  const Rating = [1, 2, 3, 4, 5];
  const [formReview, setFormReview] = useState({
    category: "",
    reviewText: "",
    rating: 0,
  });

  const statusMap = {
    "Hoàn thành": "Đã giao hàng",
    "Vận chuyển": "Đang vận chuyển",
    "Hoàn đơn": "Đơn hàng đã bị hoàn",
    "Chờ thanh toán": "Chưa thanh toán",
  };
  useEffect(() => {
    console.log(orderList);
    getAllOrder();
  }, []);
  async function getAllOrder() {
    const response = await axios.post(
      "http://localhost:3001/api/Order/OrderDetailCusID",
      { cusID: customer.id }
    );
    await setAllOrder(response.data);
    await sliceOrder(response.data);
    const response1 = await axios.post(
      "http://localhost:3001/api/Products/getFavorite",
      { cusID: customer.id }
    );
    await setFavorites(response1.data);
  }
  async function sliceOrder(OrderSample) {
    if (OrderSample !== null) {
      let pages = [];
      for (let i = 0; i < OrderSample.length; i += 3) {
        pages.push(OrderSample.slice(i, i + 3));
      }
      await setOrderList(pages);
    }
  }
  const statusFunction = (status) => {
    return statusMap[status];
  };
  useEffect(() => {
    changeStatus();
  }, [chooseStatus]);
  async function changeStatus() {
    if (chooseStatus !== "Tất cả") {
      await sliceOrder(allOrder.filter((item) => item.status === chooseStatus));
    } else {
      await sliceOrder(allOrder);
    }
  }
  const chooseQuantityPopup = async (order, index) => {
    console.log(orderList[indexList][index]);
    setOrderBuyAgain(orderList[indexList][index]);
    await setBuyOrder(order);
    await setChooseQuantity(1);
  };
  const changeQuantity = async (e) => {
    await setChooseQuantity(e.target.value);
  };
  async function handleChange(e) {
    console.log(e.target.name);
    const newValue = { ...formReview, [e.target.name]: e.target.value };
    await setFormReview(newValue);
  }
  useEffect(() => {}, [chooseQuantity]);
  const buyAgain = async () => {
    const selectCart = [
      {
        ...buyOrder,
        Quantity: chooseQuantity,
        totalAmount: chooseQuantity * buyOrder.productPrice + 32000,
      },
    ];
    navigate("/OrderCheckOut", { state: { selectCart } });
  };
  async function handleChange(e) {
    if (
      e.target.name === "rating" &&
      (e.target.value < 0 || e.target.value > 5)
    ) {
      alert("Số sao chỉ từ 0 đến 5");
      await setFormReview({ ...formReview, rating: 0 });
    }
    if (
      e.target.value === "shipper" &&
      orderList[indexList][reviewPopup].shipperID === null
    ) {
      alert("Sản phẩm này chưa có người giao hàng nên không thể đánh giá");
      await setFormReview({ ...formReview, category: "" });
    }
    const newValue = { ...formReview, [e.target.name]: e.target.value };
    await setFormReview(newValue);
  }
  useEffect(() => {
    console.log(formReview);
  }, [formReview]);
  const closeReviewPopup = async () => {
    await setReviewPopup(null);
    await setFormReview({
      category: "",
      reviewText: "",
      rating: 0,
    });
  };

  const handleSubmit = async () => {
    console.log(formReview);
    if (formReview.category == "" || formReview.reviewText == "") {
      console.log(123)
      setFillRating(true);
      setTimeout(() => {
        setFillRating(false);
      }, 2000);
    }else{
    const cusID = customer.id;
    let categoryID;
    if (formReview.category === "product") {
      categoryID = orderList[indexList][reviewPopup].productID;
    } else if (formReview.category === "shop") {
      categoryID = orderList[indexList][reviewPopup].shopID;
    } else {
      categoryID = orderList[indexList][reviewPopup].shipperID;
    }
    const response = await axios.post(
      "http://localhost:3001/api/Review/review",
      { formReview, cusID, categoryID }
    );
    if (response.status === 200) {
      await setMessPopup("thành công");
    } else {
      await setMessPopup("thất bại");
    }
    closeReviewPopup();
    }
  };
  async function payment(orders) {
    const response = await axios.post(
      "http://localhost:3001/api/Order/getOrderByOrderItem",
      { OrderID: orders.orderID }
    );
    const selectCart = response.data;
    navigate("/OrderCheckOut", { state: { selectCart } });
  }
  const changeIndex = async (value) => {
    await setIndexList(value);
  };
  const redirectshop = (shopID) => {
    setShopID(shopID);
    navigate("/ ");
  };
  useEffect(() => {
    setIndexList(0);
  }, [chooseStatus]);
  return (
    <div className={styles.viewOrder}>
      <div className={styles.orderStatus}>
        <div
          onClick={() => setChooseStatus("Tất cả")}
          className={chooseStatus === "Tất cả" ? styles.choose : ""}
        >
          Tất cả
        </div>
        <div
          onClick={() => setChooseStatus("Chờ thanh toán")}
          className={chooseStatus === "Chờ thanh toán" ? styles.choose : ""}
        >
          Chờ thanh toán
        </div>
        <div
          onClick={() => setChooseStatus("Vận chuyển")}
          className={chooseStatus === "Vận chuyển" ? styles.choose : ""}
        >
          Vận chuyển
        </div>
        <div
          onClick={() => setChooseStatus("Hoàn thành")}
          className={chooseStatus === "Hoàn thành" ? styles.choose : ""}
        >
          Hoàn thành
        </div>
        <div
          onClick={() => setChooseStatus("Hoàn đơn")}
          className={chooseStatus === "Hoàn đơn" ? styles.choose : ""}
        >
          Hoàn đơn
        </div>
      </div>
      <div className={styles.listOrder}>
        <div style={{ width: "64%" }}>
          {orderList.length > 0 &&
            orderList[indexList].map((order, index) => (
              <div className={styles.orderDetail} key={index}>
                <div className={styles.orderDetailTop}>
                  <div>
                    {order.productCategory}
                    <button onClick={() => redirectshop(order.ShopID)}>
                      Xem shop
                    </button>
                  </div>
                  {statusFunction(order.status)}
                </div>
                <div className={styles.orderDetailCenter}>
                  <div style={{ display: "flex", width: "60%" }}>
                    <img src={order.productImg} alt="product" />
                    <div>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/product/${order.productID}`)}
                      >
                        {order.productName}
                      </p>
                      <p style={{ color: "#bbbaba" }}>{order.description}</p>
                      <button
                        className={`${
                          order.status === "Chờ thanh toán" ? styles.hidden : ""
                        }`}
                        onClick={() => setReviewPopup(index)}
                      >
                        Đánh Giá
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/OrderDetail/${order.orderDetailID}`, {
                            state: order,
                          })
                        }
                      >
                        Chi tiết
                      </button>
                      <button
                        className={`${
                          order.status === "Chờ thanh toán" ? styles.hidden : ""
                        }`}
                        onClick={() => chooseQuantityPopup(order, index)}
                      >
                        Mua Lại
                      </button>

                      <button
                        className={`${
                          order.status === "Chờ thanh toán" ? "" : styles.hidden
                        }`}
                        onClick={() => payment(order)}
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>
                  <div className={styles.paymentProduct}>
                    <p>
                      {Number(order.productPrice).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                      <span style={{ paddingLeft: "10px" }}>
                        {" "}
                        x {order.Quantity}
                      </span>
                    </p>
                    <p>
                      Mã giảm giá:{" "}
                      {Number(order.discount).toLocaleString("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      Thành tiền:{" "}
                      <span>
                        {Number(
                          order.productPrice * order.Quantity - order.discount
                        ).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.orderDetailBottom}></div>
              </div>
            ))}
          <div className={styles.pageControll}>
            <span
              className={indexList === 0 ? styles.hidden : ""}
              onClick={() => changeIndex(indexList - 1)}
            >
              &lt;
            </span>
            {orderList.map((item, index) => (
              <span
                className={`${styles.indexList} ${
                  index === indexList ? styles.choosePage : ""
                } `}
                onClick={() => changeIndex(index)}
              >
                {index + 1}
              </span>
            ))}
            <span
              className={indexList >= orderList.length - 1 ? styles.hidden : ""}
              onClick={() => changeIndex(indexList + 1)}
            >
              &gt;
            </span>
          </div>
        </div>
        <div className={styles.favorite}>
          <h2>Các sản phẩm bạn thích </h2>
          {favorites.length !== 0 ? (
            favorites.map((item) => (
              <div
                className={styles.favoriteItem}
                onClick={() => navigate(`/product/${item.ProductID}`)}
              >
                <img alt="" src={item.ProductImg} />
                <div>
                  <p>{item.ProductName}</p>
                  <p>{item.Description}</p>
                  <p>Giá: {item.Price}</p>
                  <p>Khối lượng: {item.Weight}g</p>
                  <p>Còn: {item.StockQuantity} sản phẩm</p>
                </div>
              </div>
            ))
          ) : (
            <h3>Bạn chưa thích sản phẩm nào</h3>
          )}
        </div>
      </div>
      {reviewPopup !== null ? (
        <div
          className={styles.popup}
          onClick={(e) =>
            e.target === e.currentTarget ? closeReviewPopup() : ""
          }
        >
          <div className={styles.innerPopup}>
            <h2>Đánh giá sản phẩm {orderList[reviewPopup].productName}</h2>
            <label>Chọn danh mục:</label>
            <select
              name="category"
              value={formReview.category}
              onChange={(e) => handleChange(e)}
            >
              <option value="">-- Chọn --</option>
              <option value="product">Sản phẩm</option>
              <option value="shipper">Người giao hàng</option>
              <option value="shop">Cửa hàng</option>
            </select>
            <label>Chọn số sao (1 đến 5):</label>
            {Rating.map((item, index) => (
              <span
                onClick={() =>
                  handleChange({ target: { name: "rating", value: item } })
                }
              >
                {formReview.rating > index ? "⭐" : "★"}
              </span>
            ))}
            <label>Nhập đánh giá:</label>
            <textarea
              name="reviewText"
              value={formReview.reviewText}
              onChange={handleChange}
              rows="5"
            ></textarea>
            <button className="" onClick={() => handleSubmit()}>
              Gửi Đánh Giá
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {messPopup !== null ? (
        <div
          className={styles.popup}
          onClick={(e) =>
            e.target === e.currentTarget ? setMessPopup(null) : ""
          }
        >
          <div className={styles.innerPopup}>
            <h2
              style={{
                marginTop: "50%",
                transform: "translateY(-50%)",
                textAlign: "center",
              }}
            >
              Đánh giá {messPopup}
            </h2>
          </div>
        </div>
      ) : (
        ""
      )}
      {chooseQuantity !== null ? (
        <div
          className={styles.popup}
          onClick={(e) =>
            e.target === e.currentTarget ? setChooseQuantity(null) : ""
          }
        >
          <div className={styles.poupQuantity}>
            <p>
              Số lượng còn lại:
              {orderBuyAgain ? orderBuyAgain.stockQuantity : ""}{" "}
            </p>
            <label>Chọn số lượng:</label>
            <br />
            <br />
            <input
              type="number"
              name="quantity"
              value={chooseQuantity}
              onChange={changeQuantity}
            />
            <br />
            <br />
            <button onClick={() => buyAgain()}>Mua lại</button>
          </div>
        </div>
      ) : (
        ""
      )}
      {fillRatring ? (
        <div className={styles.share}>Hãy điền đầy đủ thông tin</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ViewOrder;

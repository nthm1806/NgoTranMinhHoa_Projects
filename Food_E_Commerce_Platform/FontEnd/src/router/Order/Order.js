import React, { useEffect, useState } from "react";
import styles from "./Order.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Address from "../../components/address/Address";
import { useAuth } from "../../globalContext/AuthContext";

function Order() {
  const { customerID } = useAuth();
  const location = useLocation();
  const inforFullUser = localStorage.getItem("user");
  const [cusID, setCusID] = useState();
  const { selectCart, selectAddress } = location.state || null;
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [voucher, setVoucher] = useState(false);
  const [chooseVoucher, setChooseVoucher] = useState({
    Discount: 0,
    voucher: null,
  });
  const [typeVoucher, setTypeVoucher] = useState();
  const [voucherShop, setVoucherShop] = useState([]);
  const [bestVoucherShop, setBestVoucherShop] = useState([]);
  const [status, setStatus] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Trả sau");
  const [mess, setMess] = useState(false);
  const [totalAmountProduct, setTotalAmountProduct] = useState([]);
  const [voucherDetail, setVoucherDetail] = useState([]);
  const [products, setProducts] = useState([]);
  const [listVoucher, setListVoucher] = useState([]);
  const [indexList, setIndexList] = useState(0);
  const [listProducts, setListProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [address, setAddress] = useState(selectAddress);
  const [customerCoin, setCustomerCoin] = useState(0);
  const refundCoin = Math.floor(totalPrice / 1000);

  const fetchCustomerCoin = async () => {
    if (!customerID) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/customers/${customerID}`
      );
      setCustomerCoin(response.data.xu);
    } catch (error) {
      console.error("❌ Lỗi khi lấy số xu:", error);
    }
  };

  // 🔹 Gọi API khi `customerID` thay đổi
  useEffect(() => {
    if (customerID) {
      fetchCustomerCoin();
    }
  }, [customerID]);

  const setCoin = async (totalPrice) => {
    if (!customerID) {
      alert("❌ Không xác định được khách hàng!");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/customers/${customerID}`, {
        xu: customerCoin + refundCoin,
      });
      setCustomerCoin((prev) => prev + refundCoin);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật xu:", error);
      alert("❌ Lỗi khi cập nhật xu!");
    }
  };

  useEffect(() => {
    console.log(selectAddress);
    if (!selectCart || selectCart === null || selectCart.length === 0) {
      navigate("/");
    } else {
      const cus = JSON.parse(inforFullUser);
      setCusID(cus.id);
    }
  }, []);
  useEffect(() => {
    getProduct();
    getFavorite();
  }, [cusID]);
  async function getFavorite() {
    const response = await axios.post(
      "http://localhost:3001/api/Products/getFavorite",
      { cusID }
    );
    await setFavorites(response.data.slice(0, 5));
  }
  async function getProduct() {
    if (selectCart !== null) {
      let pages = [];
      for (let i = 0; i < selectCart.length; i += 3) {
        pages.push(selectCart.slice(i, i + 3));
      }
      await setListProducts(pages);
    }
  }
  useEffect(() => {
    if (listProducts.length > 0) {
      changeIndex(indexList);
    }
  }, [listProducts]);
  const changeIndex = async (value) => {
    await setIndexList(value);
    await setProducts(listProducts[value]);
  };
  useEffect(() => {
    if (products.length !== 0) {
      let newTotal = selectCart.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );
      setTotalPrice(newTotal);
    }
  }, [products]);
  useEffect(() => {
    getVoucher();
  }, [totalPrice]);

  async function getVoucher() {
    const response = await axios.post(
      "http://localhost:3001/api/Voucher/getVoucherByCusID",
      { cusID, totalPrice }
    );
    if (selectCart !== null && selectCart.length > 0) {
      const shop = selectCart.map((item) => {
        return {
          shopID: item.ShopID,
          total: item.totalAmount - item.feeShip,
        };
      });
      const responseShop = await axios.post(
        "http://localhost:3001/api/Voucher/getVoucherByShopID",
        { shop, cusID }
      );
      await setVoucherShop(responseShop.data);
    }
    await setVoucherDetail(response.data);
  }

  useEffect(() => {
    if (voucherShop.length !== 0) {
      updateVoucherShop();
    }
  }, [voucherShop]);

  async function updateVoucherShop() {
    const tmp = [];
    const tmp1 = [];
    await selectCart.map(async (item, index) => {
      const totalShip = item.feeShip;
      const bestVoucher = await getBestVoucher(
        item.totalAmount - item.feeShip,
        totalShip,
        voucherShop[index]
      );
      tmp.push(bestVoucher);
      tmp1.push(item.totalAmount - bestVoucher.Discount);
    });
    await setBestVoucherShop(tmp);
    await setTotalAmountProduct(tmp1);
  }

  useEffect(() => {
    if (totalAmountProduct.length !== 0) {
      updateVoucherAll();
    }
  }, [totalAmountProduct]);

  async function updateVoucherAll() {
    const totalShip = selectCart.reduce((sum, item) => sum + item.feeShip, 0);
    const bestVoucher = await getBestVoucher(
      totalPrice,
      totalShip,
      voucherDetail
    );
    await setChooseVoucher(bestVoucher);
  }
  const getBestVoucher = async (totalPrice, totalShip, voucherList, tmp) => {
    const discountVoucher = {
      Discount: 0,
      voucher: null,
    };
    if (voucherList) {
      voucherList.map((item) => {
        let discountTmp = 0;
        if (item.type === "Sản phẩm") {
          if (item.Discount === 0) {
            discountTmp = (totalPrice * item.DiscountPercent) / 100;
          } else {
            discountTmp =
              item.Discount < totalPrice ? item.Discount : totalPrice;
          }
        } else {
          discountTmp = totalShip;
        }
        if (discountTmp > discountVoucher.Discount) {
          discountVoucher.Discount = discountTmp;
          discountVoucher.voucher = item;
        }
      });
    }
    return discountVoucher;
  };

  async function selectVoucherShop(index) {
    await setListVoucher(voucherShop[index]);
    await setTypeVoucher(index);
    await setVoucher(!voucher);
  }
  async function selectVoucherAll() {
    await setListVoucher(voucherDetail);
    await setTypeVoucher(-1);
    await setVoucher(!voucher);
  }
  useEffect(() => {
    console.log(products);
  }, []);
  async function handleChooseVoucher(voucher) {
    let feeShip;
    let price;
    if (typeVoucher === -1) {
      feeShip = products.reduce((sum, item) => sum + item.feeShip, 0);
      price = totalPrice;
    } else {
      price = products[typeVoucher].totalAmount - products[typeVoucher].feeShip;
      feeShip = products[typeVoucher].feeShip;
    }
    let discountTmp = 0;
    if (voucher.type === "Sản phẩm") {
      if (voucher.Discount === 0) {
        discountTmp = (price * voucher.DiscountPercent) / 100;
      } else {
        discountTmp = voucher.Discount < price ? voucher.Discount : price;
      }
    } else {
      discountTmp = feeShip;
    }
    const discountVoucher = {
      Discount: discountTmp,
      voucher: voucher,
    };
    if (typeVoucher === -1) {
      await setChooseVoucher(discountVoucher);
    } else {
      setBestVoucherShop((prevItems) =>
        prevItems.map((item, index) =>
          index === typeVoucher ? discountVoucher : item
        )
      );
    }
    setVoucher(!voucher);
  }
  async function checkout() {
    const totalPayment = totalPrice - chooseVoucher.Discount;
    const OrderInfor = [];
    console.log("selectCart: ", selectCart);
    selectCart.map((item) =>
      OrderInfor.push({
        feeShip: item.feeShip,
        productID: item.productID,
        productImg: item.ProductImg,
        productCategory: item.productCategory,
        Quantity: item.Quantity,
        CartDetailID: item.cartID || null,
        distance: Math.random() * 6,
      })
    );
    const voucherChoose = [...bestVoucherShop, chooseVoucher];
    if (paymentMethod === "Trả trước") {
      const response = await axios.post(
        "http://localhost:3001/api/Order/prepay",
        { address, OrderInfor, voucherChoose, totalPayment, cusID }
      );
      window.location.href = response.data.payUrl;
    } else {
      const response = await axios.post(
        "http://localhost:3001/api/Order/CheckOut",
        { address, OrderInfor, voucherChoose, totalPayment, cusID }
      );
      if (response.status === 200) {
        await setStatus(true);
        setCoin(totalPrice);
      } else await setStatus(false);
      await setMess(true);
    }
  }
  return (
    <div className={styles.Order}>
      <Header></Header>
      <div className={styles.link}>
        <a href="/">Home</a> {"  "}&gt;{"  "}
        <a href="/cart">Cart</a>
        {"  "} &gt;{"  "}
        <a>Order Check Out</a>
      </div>
      <div className={styles.address}>
        <Address setInfor={setAddress} infor={address}></Address>
      </div>

      <div
        style={{
          display: "flex",
          width: "82%",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div className={styles.content}>
          {/* BẢNG PRODUCT */}
          <div className={styles.OrderDetail}>
            <table style={{ padding: "20px 20px 0", backgroundColor: "white" }}>
              <tr>
                <th style={{ width: "35%" }}>Sản phẩm</th>
                <th className={styles.t2}>Giá thành</th>
                <th className={styles.t3}>Số lượng</th>
                <th className={styles.t4}>Phí vận chuyển</th>
                <th className={styles.t5}>Tổng tiền</th>
              </tr>
            </table>
            {products.length !== 0 &&
              products.map((item, index) => (
                <div className={styles.product}>
                  <table>
                    <tr>
                      <td className={styles.tdFirst}>
                        <img alt="" src={item.productImg} />
                        <p>
                          {item.productName}
                          <br /> <span>{item.productCategory}</span>
                        </p>
                      </td>
                      <td className={styles.t2}>
                        {Number(item.productPrice).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className={styles.t3}>{item.Quantity}</td>
                      <td className={styles.t4}>
                        {Number(item.feeShip).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className={styles.t5}>
                        {Number(item.totalAmount).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  </table>
                  <div className={styles.shopVoucher}>
                    <div
                      style={{
                        padding: "0 20px 0 0",
                        borderRight: "2px solid rgb(175, 175, 175)",
                      }}
                    >
                      <button
                        onClick={() => selectVoucherShop(3 * indexList + index)}
                      >
                        Chọn mã giảm giá của cửa hàng
                      </button>
                      <p>
                        {Number(
                          bestVoucherShop[3 * indexList + index]
                            ? bestVoucherShop[3 * indexList + index].Discount
                            : 0
                        ).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                    <div style={{ paddingLeft: " 20px" }}>
                      <p>Tổng tiền sản phẩm</p>
                      <p style={{ color: "red", fontWeight: "500" }}>
                        {Number(
                          totalAmountProduct[3 * indexList + index]
                            ? totalAmountProduct[3 * indexList + index]
                            : 0
                        ).toLocaleString("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.pageControll}>
            <span
              className={indexList === 0 ? styles.hidden : ""}
              onClick={() => changeIndex(indexList - 1)}
            >
              &lt;
            </span>
            {listProducts.map((item, index) => (
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
              className={
                indexList === listProducts.length - 1 ? styles.hidden : ""
              }
              onClick={() => changeIndex(indexList + 1)}
            >
              &gt;
            </span>
          </div>
          {/* VOUCHER  */}
          <div className={styles.VoucherandTotal}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img alt="" src="./voucherIcon.png" />
                <h2>Mã giảm giá</h2>
              </div>
              <p>Phương thức thanh toán :{paymentMethod}</p>
              <p>Giảm giá</p>
              <p>Tổng thanh toán</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <button onClick={() => selectVoucherAll()}>
                Chọn mã giảm giá{" "}
              </button>
              <select
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="Trả sau">Trả sau</option>
                <option value="Trả trước">Trả trước</option>
              </select>
              <p>
                {chooseVoucher
                  ? Number(chooseVoucher.Discount).toLocaleString("vi-VI", {
                      style: "currency",
                      currency: "VND",
                    })
                  : ""}
              </p>
              <p>
                {chooseVoucher
                  ? Number(totalPrice - chooseVoucher.Discount).toLocaleString(
                      "vi-VI",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )
                  : ""}
              </p>
              <button
                onClick={() => checkout()}
                style={{
                  padding: "10px",
                  border: "2px solid rgb(175, 175, 175)",
                }}
              >
                Xác nhận mua
              </button>
            </div>
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

      {/* VOUCHER POPUP */}
      {voucher ? (
        <div
          onClick={(e) =>
            e.currentTarget === e.target ? setVoucher(false) : ""
          }
          className={styles.voucherPopup}
        >
          <div className={styles.voucherInner}>
            <h1>Chọn mã giảm giá</h1>
            {listVoucher.length === 0 ? (
              <h2 style={{ textAlign: "center" }}>Không có mã giảm giá </h2>
            ) : (
              ""
            )}
            {listVoucher.length !== 0 &&
              listVoucher.map((item) => (
                <div
                  className={styles.VoucherDetail}
                  onClick={() => handleChooseVoucher(item)}
                >
                  <div className={styles.VoucherImg}>
                    <p> Voucher {item.type}</p>
                  </div>
                  <div className={styles.inforVoucher}>
                    <p>{item.VoucherName}</p>
                    <p>Loại: {item.type}</p>
                    <p>
                      Giảm: {"  "}
                      {item.Discount === 0
                        ? item.DiscountPercent + "%"
                        : Number(item.Discount).toLocaleString("vi-VI", {
                            style: "currency",
                            currency: "VND",
                          })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        ""
      )}
      {mess ? (
        <div
          onClick={() => navigate("/")}
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "30px",
              backgroundColor: "orange",
              width: "40vw",
              height: "30vh",
              display: "flex",
              flexDirection: "column", // 🔹 Căn theo chiều dọc
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center", // 🔹 Căn giữa nội dung
            }}
          >
            <div>{status ? "CHECKOUT THÀNH CÔNG" : "CHECKOUT THẤT BẠI"}</div>

            {status && refundCoin > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                🎉 Bạn nhận được{" "}
                <span style={{ color: "#FFD700" }}>{refundCoin}</span> xu!
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <Footer></Footer>
    </div>
  );
}

export default Order;

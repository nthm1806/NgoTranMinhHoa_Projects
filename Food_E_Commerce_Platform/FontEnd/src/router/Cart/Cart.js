import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Address from "../../components/address/Address";
import styles from "./Cart.module.css";
import { ThemeContext } from "../../contexts/ThemeContext";

function Cart() {
  const inforFullUser = localStorage.getItem("user");
  const [cusID, setCusID] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [newTotal, setNewTotal] = useState(0);
  const [address, setAddress] = useState({
    AddressID: null, 
    HouseAddress: "", 
    Area: ""
  });
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (inforFullUser) {
      const user = JSON.parse(inforFullUser);
      setCusID(user.id);
    }
  }, [inforFullUser]);

  useEffect(() => {
    if (cusID) {
      const fetchCart = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/Cart/cusID', { cusID: cusID });
          console.log("Fetched Cart Data:", response.data);
          await setCartItems(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy giỏ hàng:", error);
        }
      };
      fetchCart();
    }
  }, [cusID])

  useEffect(() => {
    console.log("Update address:", address);
  }, [address]);

  const updateQuantity = async (cartID, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.cartID === cartID) {
          const newQuantity = Math.max(1, Math.min(item.Quantity + amount, item.productQuantity));
          const updatedProductQuantity = { ...item, Quantity: newQuantity };
          return {
            ...item,
            Quantity: newQuantity,
            newQuantity: updatedProductQuantity
          };
        }
        return item;
      })
    );

    try {
      await axios.put('http://localhost:3001/api/Cart/updateQuantity', { cartID, amount });
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (cartID) => {
    try {
      await axios.delete(`http://localhost:3001/api/Cart/deleteItem`, { data: { cartID } });
      setCartItems(prevItems => prevItems.filter(item => item.cartID !== cartID));
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.cartID));
    }
    setSelectedAll(!selectedAll);
  }

  const handleSelectItem = (cartID) => {
    if (cartID === undefined || cartID === null) {
      console.error("Error: cartDetailID is undefined or null!");
      return;
    }

    setSelectedItems(prevSelected => 
      prevSelected.includes(cartID)
        ? prevSelected.filter(id => id !== cartID)
        : [...prevSelected, cartID]
    );
  };

  useEffect(() => {
    const newTotal = cartItems
      .filter((item) => selectedItems.includes(item.cartID))
      .reduce((total, item) => total + item.productPrice * item.Quantity, 0);
    setNewTotal(newTotal);
  }, [selectedItems, cartItems]);

  const handleCheckout = async () => {
    if (!address) {
      alert("Please select an address before checking out.");
      return;
    }
    const selectCart = await cartItems.filter((item) => selectedItems.includes(item.cartID));
    navigate("/OrderCheckOut", { state: selectCart, address });
  };

  return (
    <div className={`${styles.cartWrapper} ${theme === "dark" ? styles.dark : ""}`}>
      <Header />
      <div className={`${styles.cart_container} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.link}>
          <a href="/">Trang Chủ</a>
          {" "} &gt; {" "}
          <a href="/cart">Giỏ hàng</a>
        </div>
        <h2 className={`${styles.cart_header} ${theme === "dark" ? styles.darkText : ""}`}>Giỏ hàng</h2>
        <div className={`${styles.address} ${theme === "dark" ? styles.darkText : ""}`}>
          <Address setInfor={setAddress} />
        </div>
        <div className={`${styles.cart_content} ${theme === "dark" ? styles.dark : ""}`}>
          <table style={{ backgroundColor: theme === "dark" ? '#333' : 'white' }}>
            <thead>
              <tr>
                <th className={styles.c0}><input type="checkbox"
                  checked={selectedAll}
                  onChange={handleSelectAll} /></th>
                <th className={styles.c1}>Sản phẩm</th>
                <th className={styles.c2}>Cửa hàng</th>
                <th className={styles.c3}>Giá</th>
                <th className={styles.c4}>Số lượng</th>
                <th className={styles.c5}>Số tiền</th>
                <th className={styles.c6}>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className={`${styles.empty_cart} ${theme === "dark" ? styles.darkText : ""}`}>
                    Giỏ hàng đang trống
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr key={item.cartID}>
                    <td><input
                      type="checkbox"
                      checked={selectedItems.includes(item.cartID)}
                      onChange={() => {
                        console.log("Clicked item ID:", item.cartID);
                        handleSelectItem(item.cartID);
                      }}
                    /></td>
                    <td className={styles.item_info}>
                      <img src={item.productImg} alt={item.productName} className={styles.item_image} />
                      <span className={`${styles.item_name} ${theme === "dark" ? styles.darkText : ""}`}>
                        {item.productName}
                        <br />
                        Số lượng trong kho: {item.productQuantity}
                      </span>
                    </td>
                    <td className={styles.c2}>{item.ShopName}</td>
                    <td className={styles.c3}>
                      {item.productPrice.toLocaleString()} VNĐ
                    </td>
                    <td className={styles.c4}>
                      <div className={styles.quantity_control}>
                        <button className={`${styles.quantity_button} ${theme === "dark" ? styles.darkButton : ""}`} onClick={() => updateQuantity(item.cartID, -1)}>-</button>
                        <span className={styles.quantity_value}>{item.Quantity}</span>
                        <button className={`${styles.quantity_button} ${theme === "dark" ? styles.darkButton : ""}`} onClick={() => updateQuantity(item.cartID, 1)}>+</button>
                      </div>
                    </td>
                    <td className={styles.c5}>
                      {(item.productPrice * item.Quantity).toLocaleString()} VNĐ
                    </td>
                    <td className={styles.c6}>
                      <button className={`${styles.remove_button} ${theme === "dark" ? styles.darkButton : ""}`} onClick={() => removeItem(item.cartID)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {cartItems.length > 0 && (
            <div className={`${styles.total} ${theme === "dark" ? styles.darkText : ""}`}>
              <h3>Tổng: {newTotal.toLocaleString()} VNĐ</h3>
              <button className={`${styles.checkout_button} ${theme === "dark" ? styles.darkButton : ""}`} onClick={handleCheckout}>Mua hàng</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

};

export default Cart;
import React, { useEffect, useState, useContext } from "react";
import { formatMoney } from "../utils";
import styles from "./card/styles.module.css";
import { iconFail, iconFavorite, iconFavoriteDefault, iconSuccess } from "./icon/Icon";
import { deleteProductFavorite, setProductFavorite } from "../service/product";
import { CustomerBehaviorContext } from "../globalContext/CustomerBehaviorContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../globalContext/AuthContext";
import { updateCart } from "../service/cart";
import { useCart } from "../globalContext/CartContext";
import { ModalNotify } from "./modal/ModalCustom";

const Card = ({ item, isFavoriteProduct }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: "", icon: null });
  const navigate = useNavigate();
  const { fetchAddCustomerBehavior } = useContext(CustomerBehaviorContext);
  const { customerID } = useAuth();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    setIsFavorite(isFavoriteProduct);
  }, [isFavoriteProduct]);

  const handleGotoDetail = (id) => {
    navigate("/product/" + id);
  };

  const handleSetFavorite = async () => {
    setIsFavorite(!isFavorite);
    try {
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser);
      if (!isFavorite) {
        await setProductFavorite({ CustomerID: userData.id, ProductID: item.ProductID });
      } else {
        await deleteProductFavorite({ CustomerID: userData.id, ProductID: item.ProductID });
      }
    } catch (error) {
      console.error("Error handleSetFavorite: ", error);
    }
  };

  const handleAddToCart = async (e) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser);

      const rs = await updateCart({
        customerID: userData.id,
        productID: item.ProductID,
        quantity: 1,
      });

      fetchCartCount();

      setNotify({
        icon: rs.data?.status === 200 ? iconSuccess : iconFail,
        message: rs.data?.status === 200 ? rs.data?.message || "Thêm thành công" : "Thêm thất bại",
        isOpen: true,
      });

    } catch (error) {
      console.error("Error handleAddToCart: ", error);
      setNotify({
        icon: iconFail,
        message: "Thêm thất bại",
        isOpen: true,
      });
    }
  };

  return (
    <div 
      onClick={() => fetchAddCustomerBehavior(customerID, item.ProductID, item.Category, "view", item.ShopID)}
      className={styles.card_container}
    >
      <div className={styles.card_imageContainer}>
        <img className={styles.card_image} src={item.ProductImg} alt={item.ProductName} onClick={() => handleGotoDetail(item.ProductID)} />
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_infoContainer}>
          <span className={styles.card_infoTitle} onClick={() => handleGotoDetail(item.ProductID)}>
            {item.ProductName}
          </span>
          <p className={styles.card_infoQuantity}>Đã Bán: {item.SoldQuantity}</p>
          <span className={styles.card_infoMoney}>{formatMoney(item.Price)} VND</span>
        </div>
        <div className={styles.card_footer}>
          <div onClick={handleSetFavorite} className={styles.card_infoRight_favorite}>
            {isFavorite ? iconFavorite : iconFavoriteDefault}
          </div>
          <button className={styles.card_button} onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
      <ModalNotify notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default Card;

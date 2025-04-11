import React, { useState } from "react";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import styles from "./OrderandVoucher.module.css";
import ViewOrder from "../../components/ViewOrder/ViewOrder";
import StoreVoucher from "../../components/StoreVoucher/StoreVoucher";
import { useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../globalContext/GlobalContext";

function StatusOrrder() {
  const { name, avatar } = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [chooseFunction, setChooseFunction] = useState("Đơn mua");
  console.log(localStorage.getItem("user"));
  return (
    <div>
      <Header></Header>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <div className={styles.index}>
            <div
              className={styles.indexIntro}
              onClick={() => navigate("../customers/")}
            >
              <img alt="" src={avatar} />
              {name}
            </div>
            <div
              className={`${styles.function} ${
                chooseFunction === "Đơn mua" ? styles.choose : ""
              }`}
              onClick={() => setChooseFunction("Đơn mua")}
            >
              <img alt="" src="./orderIcon.png" />
              Đơn mua
            </div>
            <div
              className={`${styles.function} ${
                chooseFunction === "Kho mã giảm giá" ? styles.choose : ""
              }`}
              onClick={() => setChooseFunction("Kho mã giảm giá")}
            >
              <img alt="" src="./voucherIcon.png" />
              Kho mã giảm giá
            </div>
          </div>
          {chooseFunction === "Đơn mua" ? (
            <GlobalProvider>
              <ViewOrder></ViewOrder>
            </GlobalProvider>
          ) : (
            <StoreVoucher></StoreVoucher>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default StatusOrrder;

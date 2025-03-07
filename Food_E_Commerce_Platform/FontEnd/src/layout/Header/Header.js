import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import MenuHeader from "../MenuHeader/MenuHeader";
import Search from "../Search/Search";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "../../i18n.js";
import LanguageSwitcher from "../../components/Language/LanguageSwitcher.js";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();


  // Hàm điều hướng
  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // Lấy dữ liệu user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleClick = (e) => {
    if (e === "Tài Khoản") {
      if (user) {
        navigate("/customers"); // Nếu đã đăng nhập, chuyển đến trang tài khoản
      } else {
        navigate("/login"); // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      }
    } else if (e === "Thông Báo") {
      navigate("/Notifications");
    } else if (e === "Hỗ Trợ") {
      navigate("/Portal");
    } else if (e === "Giỏ Hàng") {
      navigate("/cart");
    }
  };
  

  return (
    <header className={`${styles.wrapper} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={`${styles.header} ${theme === "dark" ? styles.dark : ""}`}>
        <img
          src="/logo.png"
          alt="logo-header"
          style={{ height: "6vh", width: "8%", cursor: "pointer" }}
          onClick={() => handleNavigate("/")}
        />

        <MenuHeader />
        <Search />

        <div className={`${styles.fhs_center_space_header} ${theme === "dark" ? styles.dark : ""}`}>
          <div onClick={() => handleClick("Thông Báo")} className={`${styles.fhs_noti_header} ${theme === "dark" ? styles.darkItem : ""}`}>
            <img
              src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_noti_gray.svg"
              alt=""
              className={styles.fhs_noti_icon_header}
            />
            <div className={`${styles.fhs_top_menu_labe} ${theme === "dark" ? styles.darkText : ""}`}>{t("Notifications")}</div>
          </div>
          <div
            onClick={() => handleNavigate("/Portal")}
            className={`${styles.fhs_noti_header} ${theme === "dark" ? styles.darkItem : ""}`}>
            <img
              style={{ width: "2.5vw" }}
              src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-question-mark-vector-icon-png-image_5152512.jpg"
              alt=""
              className={styles.fhs_noti_icon_header}
            />
            <div className={`${styles.fhs_top_menu_labe} ${theme === "dark" ? styles.darkText : ""}`}>{t("Portal")}</div>
          </div>
          <div
            onClick={() => handleNavigate("/cart")}
            className={`${styles.fhs_noti_header} ${theme === "dark" ? styles.darkItem : ""}`}>
            <img
              src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_cart_gray.svg"
              alt=""
              className={styles.fhs_noti_icon_header}
            />
            <div className={`${styles.fhs_top_menu_labe} ${theme === "dark" ? styles.darkText : ""}`}>{t("cart")}</div>
          </div>
          <div
              onClick={() => handleClick("Tài Khoản")}
              className={`${styles.fhs_noti_header} ${theme === "dark" ? styles.darkItem : ""}`}
            >
              {user && user.avatar ? (
                <img src={user.avatar} alt="Avatar" className={styles.avatar} />
              ) : (
                <img
                  src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_account_gray.svg"
                  alt="Tài Khoản"
                  className={styles.fhs_noti_icon_header}
                />
              )}
              <div className={user ? styles.name : styles.fhs_top_menu_labe}>
                {user ? user.name : t("account")}
              </div>
            </div>
        </div>
        <LanguageSwitcher/>
      </div>
    </header>
  );
}

export default Header;

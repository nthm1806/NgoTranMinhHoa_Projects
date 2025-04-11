import { useState, useEffect, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CustomerProfile from "./CustomerProfile";
import Password from "./Password";
import { getCurrentCustomerById } from "./services/user.services";
import styles from "./CustomerRoutes.module.css";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Address from "./Address";
import Setting from "./Setting";
import Privacy from "./Privacy";
import Email from "./Email";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "../../i18n";

function CustomerRoutes() {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await getCurrentCustomerById(2);
        setCustomer(customerData);
        console.log(customerData);
      } catch (err) {
        setError(
          "Không thể tải dữ liệu khách hàng. " + err?.response?.data?.message
        );
        console.error(err);
      }
    };

    fetchCustomer();
  }, []);

  return (
    <div className={` ${theme === "dark" ? "dark" : ""}`}>
      <Header />

      <div className={`${styles.app} ${theme === "dark" ? styles.dark : ""}`}>
        <nav
          className={`${styles.sidebar} ${theme === "dark" ? styles.dark : ""}`}
        >
          <ul>
            <li>
              <Link to="/customers/customer-info">{t("CustomerDetail")}</Link>
            </li>
            <li>
              <Link to="/customers/password">{t("PassWord")}</Link>
            </li>
            <li>
              <Link to="/customers/email">Email</Link>
            </li>
            <li>
              <Link to="/customers/address">{t("Address")}</Link>
            </li>
            <li>
              <Link to="/customers/setting">{t("NotificationSetting")}</Link>
            </li>
            <li>
              <Link to="/customers/privacy">{t("Privacy")}</Link>
            </li>
          </ul>
        </nav>

        <div
          className={`${styles.content} ${
            theme === "dark" ? styles.darkContent : ""
          }`}
        >
          <Routes>
            <Route
              path="customer-info"
              element={
                <>
                  <h1 className={styles.headerTitle}>{t("MyDetail")}</h1>
                  {error && <p className={styles.errorText}>{error}</p>}
                  {customer ? (
                    <CustomerProfile
                      customer={customer}
                      onUpdate={setCustomer}
                    />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
            <Route
              path="password"
              element={
                <>
                  <h1 className={styles.headerTitle}>{t("PasswordChange")}</h1>
                  {customer ? (
                    <Password customer={customer} onUpdate={setCustomer} />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
            <Route
              path="email"
              element={
                <>
                  <h1 className={styles.headerTitle}>{t("EmailUpdate")}</h1>
                  {customer ? (
                    <Email
                      customerID={customer.CustomerID}
                      onUpdate={(newEmail) =>
                        setCustomer({ ...customer, Email: newEmail })
                      }
                    />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
            <Route
              path="address"
              element={
                <>
                  <h1 className={styles.headerTitle}>{t("Address")}</h1>
                  {error && <p className={styles.errorText}>{error}</p>}
                  {customer ? (
                    <Address customerID={customer.CustomerID} />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
            <Route
              path="setting"
              element={
                <>
                  <h1 className={styles.headerTitle}>
                    {t("NotificationSetting")}
                  </h1>
                  {error && <p className={styles.errorText}>{error}</p>}
                  {customer ? (
                    <Setting customerID={customer.CustomerID} />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
            <Route
              path="privacy"
              element={
                <>
                  <h1 className={styles.headerTitle}>{t("Privacy")}</h1>
                  {error && <p className={styles.errorText}>{error}</p>}
                  {customer ? (
                    <Privacy customerID={customer.CustomerID} />
                  ) : (
                    <p className={styles.loadingText}>{t("Loading")}</p>
                  )}
                </>
              }
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CustomerRoutes;

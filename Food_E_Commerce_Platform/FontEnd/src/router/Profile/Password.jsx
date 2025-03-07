import { useState, useContext } from "react";
import { updateCustomerById } from "./services/user.services";
import styles from "./Password.module.css"; // Import CSS module
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext
import { useTranslation } from "react-i18next";
import "../../i18n";
const Password = ({ customer }) => {
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { theme } = useContext(ThemeContext); // Lấy trạng thái Dark Mode từ Context

    const handleChangePassword = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Kiểm tra xem có đủ thông tin không
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Xác nhận mật khẩu mới không khớp!");
            return;
        }

        try {
            // Gửi mật khẩu cũ và mật khẩu mới đến backend
            await updateCustomerById(customer.CustomerID, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccess("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError("Có lỗi xảy ra: " + err?.response?.data?.message);
        }
    };

    return (
        <div className={`${styles.passwordContainer} ${theme === "dark" ? styles.darkContainer : ""}`}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <form onSubmit={handleUpdatePassword} className={styles.passwordForm}>
                <label className={styles.passwordLabel}>Mật khẩu cũ:</label>
                <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handleChangePassword}
                    className={`${styles.passwordInput} ${theme === "dark" ? styles.darkInput : ""}`}
                />

                <label className={styles.passwordLabel}>Mật khẩu mới:</label>
                <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChangePassword}
                    className={`${styles.passwordInput} ${theme === "dark" ? styles.darkInput : ""}`}
                />

                <label className={styles.passwordLabel}>Xác nhận mật khẩu mới:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChangePassword}
                    className={`${styles.passwordInput} ${theme === "dark" ? styles.darkInput : ""}`}
                />

                <button type="submit" className={`${styles.passwordButton} ${theme === "dark" ? styles.darkButton : ""}`}>
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default Password;

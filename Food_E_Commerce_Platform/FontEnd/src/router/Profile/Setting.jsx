import { useState, useContext } from "react";
import styles from "./Setting.module.css";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext
import { useTranslation } from "react-i18next";
import "../../i18n";

const Setting = () => {
    const { theme } = useContext(ThemeContext); // Lấy trạng thái Dark Mode từ Context
    const [settings, setSettings] = useState({
        email_order_update: true,
        email_promotion: false,
        email_survey: true,
        sms_promotion: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={`${styles.settingContainer} ${theme === "dark" ? styles.darkContainer : ""}`}>
            {/* Email Thông báo */}
            <div className={styles.settingSection}>
                <div className={styles.settingTitle}>Email thông báo</div>
                <div className={styles.settingDescription}>
                    Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
                </div>
                <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Cập nhật đơn hàng</span>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={settings.email_order_update}
                            onChange={() => toggleSetting("email_order_update")}
                        />
                        <span className={`${styles.slider} ${theme === "dark" ? styles.darkSlider : ""}`}></span>
                    </label>
                </div>
                <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Khuyến mãi</span>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={settings.email_promotion}
                            onChange={() => toggleSetting("email_promotion")}
                        />
                        <span className={`${styles.slider} ${theme === "dark" ? styles.darkSlider : ""}`}></span>
                    </label>
                </div>
                <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Khảo sát</span>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={settings.email_survey}
                            onChange={() => toggleSetting("email_survey")}
                        />
                        <span className={`${styles.slider} ${theme === "dark" ? styles.darkSlider : ""}`}></span>
                    </label>
                </div>
            </div>

            {/* Thông báo SMS */}
            <div className={styles.settingSection}>
                <div className={styles.settingTitle}>Thông báo SMS</div>
                <div className={styles.settingDescription}>
                    Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
                </div>
                <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Khuyến mãi</span>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={settings.sms_promotion}
                            onChange={() => toggleSetting("sms_promotion")}
                        />
                        <span className={`${styles.slider} ${theme === "dark" ? styles.darkSlider : ""}`}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Setting;

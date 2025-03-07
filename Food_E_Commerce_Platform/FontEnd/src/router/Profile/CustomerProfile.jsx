import { useState, useEffect, useContext } from "react";
import { updateCustomerById } from "./services/user.services";
import styles from "./CustomerProfile.module.css";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "../../i18n.js";

const CustomerProfile = ({ customer, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [previewAvatar, setPreviewAvatar] = useState(customer?.Avatar || "");
    const { theme } = useContext(ThemeContext); 
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        CustomerID: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        Email: "",
        PhoneNumber: "",
        Gender: "",
        Avatar: null,
    });
    


    const [validationErrors, setValidationErrors] = useState({
        FirstName: "",
        LastName: "",
        PhoneNumber: "",
        Email: "",
    });
    

    useEffect(() => {
        if (customer) {
            const date = customer.DateOfBirth ? new Date(customer.DateOfBirth) : null;
            const formattedDate = date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                : "";

            setFormData({
                CustomerID: customer.CustomerID || "",
                FirstName: customer.FirstName || "",
                LastName: customer.LastName || "",
                DateOfBirth: formattedDate,
                Email: customer.Email || "",
                PhoneNumber: customer.PhoneNumber || "",
                Gender: customer.Gender || "",
                Avatar: null,
            });

            setPreviewAvatar(customer.Avatar || "");
        }
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, Avatar: file });

        if (file) {
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();

        let errors = {
            FirstName: "",
            LastName: "",
            PhoneNumber: "",
        };

        // Kiểm tra PhoneNumber không được để trống
        if (!formData.PhoneNumber) errors.PhoneNumber = t("PhoneError");

        // Kiểm tra PhoneNumber chỉ chứa chữ số
        const phoneNumberRegex = /^[0-9]+$/;
        if (formData.PhoneNumber && !phoneNumberRegex.test(formData.PhoneNumber)) {
            errors.PhoneNumber = t("PhoneRegex");
        }

        // Kiểm tra FirstName và LastName không có số
        const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s]+$/;

        if (!formData.FirstName) {
            errors.FirstName = t("FirstNull");
        } else if (!nameRegex.test(formData.FirstName)) {
            errors.FirstName = t("FirstRegex");
        }

        if (!formData.LastName) {
            errors.LastName = t("LastNull");
        } else if (!nameRegex.test(formData.LastName)) {
            errors.LastName = t("LastRegex");
        }

        // Kiểm tra ngày sinh hợp lệ
        const today = new Date();
        const birthDate = new Date(formData.DateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (!formData.DateOfBirth) {
            errors.DateOfBirth = t("DOBnull");
        } else if (age > 150) {
            errors.DateOfBirth = t("DOBmax");
        } else if (age < 0) {
            errors.DateOfBirth = t("DOBerror");
        }

        // Nếu có lỗi, set errors và không gửi form
        if (Object.values(errors).some((error) => error !== "")) {
            setValidationErrors(errors);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            await updateCustomerById(customer.CustomerID, formDataToSend);
            onUpdate({ ...formData, Avatar: previewAvatar });
            setIsEditing(false);
            setError("");
        } catch (err) {
            setError("Có lỗi xảy ra khi cập nhật: " + err?.response?.data?.message);
            console.error(err);
        }
    };

    const maskEmail = (email) => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        const maskedName = name.length > 3 ? name.substring(0, 3) + "*****" : "*****";
        return `${maskedName}@${domain}`;
    };

    const maskPhoneNumber = (phone) => {
        if (!phone) return "";
        return phone.slice(0, 3) + "*****" + phone.slice(-2);
    };

    return (
        <div className={`${styles.profileWrapper} ${theme === "dark" ? styles.dark : ""}`}>
            <div className={`${styles.profileContainer} ${theme === "dark" ? styles.darkContainer : ""}`}>
                <div className={styles.avatarContainer}>
                    <img src={previewAvatar} alt="Avatar" className={styles.avatar} />
    
                    {isEditing && (
                        <label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className={styles.hidden} />
                        </label>
                    )}
                </div>
    
                <div className={styles.infoContainer}>
                    {isEditing ? (
                        <form onSubmit={handleUpdateCustomer} className={styles.profileForm}>
                            <label>{t("FirstName")}</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={formData.FirstName}
                                onChange={handleInputChange}
                                placeholder={validationErrors.FirstName || "Nhập Họ"}
                                className={theme === "dark" ? styles.darkInput : ""}
                            />
    
                            <label>{t("LastName")}</label>
                            <input
                                type="text"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleInputChange}
                                placeholder={validationErrors.LastName || "Nhập Tên"}
                                className={theme === "dark" ? styles.darkInput : ""}
                            />
    
                            <label>{t("DOB")}</label>
                            <input
                                type="date"
                                name="DateOfBirth"
                                value={formData.DateOfBirth}
                                onChange={handleInputChange}
                                placeholder={validationErrors.DateOfBirth || "Chọn Ngày Sinh"}
                                className={theme === "dark" ? styles.darkInput : ""}
                            />
    
                            <label>{t("Phone")}</label>
                            <input
                                type="text"
                                name="PhoneNumber"
                                value={formData.PhoneNumber}
                                onChange={handleInputChange}
                                placeholder={validationErrors.PhoneNumber || "Nhập số điện thoại"}
                                className={theme === "dark" ? styles.darkInput : ""}
                            />
    
                            <label>{t("Gender")}</label>
                            <select
                                name="Gender"
                                onChange={handleInputChange}
                                className={theme === "dark" ? styles.darkSelect : ""}
                            >
                                <option value="1">{t("Male")}</option>
                                <option value="2">{t("Female")}</option>
                            </select>
    
                            <label>Email:</label>
                            <div className={styles.profileInfo}>
                                <p> <span className={styles.infoText}>{maskEmail(customer.Email)}</span></p>
                            </div>
    
                            <button type="submit" className={theme === "dark" ? styles.darkButton : ""}>{t("Update")}</button>
                            <button type="button" onClick={() => setIsEditing(false)} className={theme === "dark" ? styles.darkButton : ""}>{t("Close")}</button>
                        </form>
                    ) : (
                        <div className={styles.profileInfo}>
                            <p><strong>{t("FirstName")}</strong> <span className={styles.infoText}>{customer.FirstName}</span></p>
                            <p><strong>{t("LastName")}</strong> <span className={styles.infoText}>{customer.LastName}</span></p>
                            <p><strong>{t("DOB")}</strong> <span className={styles.infoText}>{new Date(customer.DateOfBirth).toLocaleDateString("vi-VN")}</span></p>
                            <p><strong>{t("Phone")}</strong> <span className={styles.infoText}>{maskPhoneNumber(customer.PhoneNumber)}</span></p>
                            <p><strong>{t("Gender")}</strong> <span className={styles.infoText}>{customer.Gender === "1" ? t("Male") : t("Female")}</span></p>
                            <p><strong>Email:</strong> <span className={styles.infoText}>{maskEmail(customer.Email)}</span></p>
                            <button onClick={() => setIsEditing(true)} className={theme === "dark" ? styles.darkButton : ""}>{t("Edit")}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );    
};

export default CustomerProfile;

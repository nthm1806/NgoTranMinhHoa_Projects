import React, { useEffect, useState, useCallback, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "../../i18n.js";

import { 
    getAddressByCustomerId, 
    addAddress, 
    updateAddressById, 
    removeAddress 
} from "./services/user.services";
import styles from "./Address.module.css";

const AREA_OPTIONS = ["Khu A", "Khu B", "Khu C", "Khu D"];

const Address = ({ customerID }) => {
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        houseAddress: "",
        area: "Khu A"
    });

    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext); // Lấy trạng thái Dark Mode từ ThemeContext

    // Lấy danh sách địa chỉ từ server
    const fetchAddresses = useCallback(async () => {
        try {
            const response = await getAddressByCustomerId(customerID);
            setAddresses(response);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách địa chỉ:", error);
        }
    }, [customerID]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!formData.houseAddress || !formData.area) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            await addAddress(customerID, formData.houseAddress, formData.area);
            await fetchAddresses();
            setFormData({ houseAddress: "", area: "Khu A" });
            setError("");
            setIsAdding(false);
        } catch (err) {
            setError("Có lỗi khi thêm địa chỉ!");
            console.error("Lỗi từ API:", err);
        }
    };

    const handleEditAddress = (address) => {
        setIsEditing(address.AddressID);
        setFormData({ houseAddress: address.HouseAddress, area: address.Area });
    };

    const handleUpdateAddress = async (e, addressID) => {
        e.preventDefault();
        if (!formData.houseAddress || !formData.area) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            await updateAddressById(addressID, {
                houseAddress: formData.houseAddress,
                area: formData.area
            });

            await fetchAddresses();
            setIsEditing(null);
            setError("");
        } catch (err) {
            setError("Có lỗi khi cập nhật địa chỉ!");
            console.error(err);
        }
    };

    const handleDeleteAddress = async (addressID) => {
        try {
            await removeAddress(addressID, customerID);
            await fetchAddresses();
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
        }
    };

    return (
        <div className={`${styles.profileWrapper} ${theme === "dark" ? styles.dark : ""}`}>
            <div className={styles.profileContainer}>
                <div className={styles.infoContainer}>  

                    {addresses.length === 0 ? (
                        <p>{t("NullAddress")}</p>
                    ) : (
                        addresses.map((address) =>
                            isEditing === address.AddressID ? (
                                <div className={styles.popup} key={address.AddressID}>
                                    <div className={styles.popupContent}>
                                        <form onSubmit={(e) => handleUpdateAddress(e, address.AddressID)}>
                                            {error && <p className={styles.errorMessage}>{error}</p>}
                                            <label>{t("Address")}</label>
                                            <input
                                                type="text"
                                                name="houseAddress"
                                                value={formData.houseAddress}
                                                onChange={handleInputChange}
                                            />
                                            <label>{t("Area")}</label>
                                            <select name="area" value={formData.area} onChange={handleInputChange}>
                                                {AREA_OPTIONS.map((area) => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </select>
                                            <button type="submit">{t("Save")}</button>
                                            <button type="button" className={styles.close} onClick={() => setIsEditing(null)}>{t("Close")}</button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div key={address.AddressID} className={styles.profileInfo}>
                                    <div>
                                        <p><strong>{t("Address")}</strong> <span>{address.HouseAddress}</span></p>
                                        <p><strong>{t("Area")}</strong> <span>{address.Area}</span></p>
                                    </div>
                                    <div className={styles.buttonContainer}>
                                        <button onClick={() => handleEditAddress(address)}>{t("Edit")}</button>
                                        <button onClick={() => handleDeleteAddress(address.AddressID)}>{t("Delete")}</button>
                                    </div>
                                </div>
                            )
                        )
                    )}

                    {isAdding && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <form onSubmit={handleAddAddress}>
                                    {error && <p className={styles.errorMessage}>{error}</p>}
                                    <label>{t("Address")}:</label>
                                    <input
                                        type="text"
                                        name="houseAddress"
                                        value={formData.houseAddress}
                                        onChange={handleInputChange}
                                    />
                                    <label>{t("Area")}</label>
                                    <select name="area" value={formData.area} onChange={handleInputChange}>
                                        {AREA_OPTIONS.map((area) => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                    <button type="submit">{t("Add")}</button>
                                    <button type="button" className={styles.close} onClick={() => setIsAdding(false)}>{t("Close")}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    <button onClick={() => setIsAdding(!isAdding)} className={styles.addButton}>
                        {isAdding ? t("Close") : t("Add")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Address;

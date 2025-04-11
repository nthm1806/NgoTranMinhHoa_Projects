import React from "react";
import styles from "./ContactInfo.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const ContactInfo = () => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.title}>Thông tin liên hệ</h2>
                <div className={styles.info}>
                    <p><strong>Tên công ty:</strong> Công Ty Cổ Phần Group5Food</p>
                    <p><strong>Địa chỉ:</strong> Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội</p>
                    <p><strong>Hotline:</strong> 0966.88.1862 (Mr.Hòa)</p>
                    <p><strong>Email:</strong> support@group5food.vn</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactInfo;
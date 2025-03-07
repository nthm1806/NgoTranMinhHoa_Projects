import { useState, useEffect, useContext } from "react";
import styles from "./Email.module.css";
import { getCurrentCustomerById, updateCustomerById, sendOTP, verifyOTP } from "./services/user.services";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Email = ({ customerID, onUpdate }) => {
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [verifyingOTP, setVerifyingOTP] = useState(false);
    const { theme } = useContext(ThemeContext); // Lấy theme từ context

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const customerData = await getCurrentCustomerById(customerID);
                setEmail(customerData.Email);
                setNewEmail(customerData.Email);
            } catch (err) {
                setError("Không thể tải email!");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [customerID]);

    const handleEmailChange = (e) => setNewEmail(e.target.value);
    const handleOTPChange = (e) => setOtp(e.target.value);

    const handleSendOTP = async () => {
        setError("");
        setSendingOTP(true);
        try {
            await sendOTP(newEmail);
            setStep(2);
        } catch (err) {
            setError("Không thể gửi OTP. Hãy thử lại!");
        } finally {
            setSendingOTP(false);
        }
    };

    const handleVerifyOTPAndUpdateEmail = async () => {
        setError("");
        setVerifyingOTP(true);
        try {
            const response = await verifyOTP(newEmail, otp);
            if (response.message === "Xác minh OTP thành công!") {
                await updateCustomerById(customerID, { Email: newEmail });
                setEmail(newEmail);
                setIsEditing(false);
                onUpdate(newEmail);
                setStep(1);
            } else {
                setError("OTP không hợp lệ!");
            }
        } catch (err) {
            setError("OTP không hợp lệ hoặc hết hạn!");
        } finally {
            setVerifyingOTP(false);
        }
    };

    if (loading) return <p className={styles.loadingText}>Đang tải email...</p>;

    return (
        <div className={`${styles.emailContainer} ${theme === "dark" ? styles.dark : ""}`}>
            {isEditing ? (
                <div className={styles.editEmail}>
                    {step === 1 ? (
                        <>
                            <h2>Email Mới:</h2>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={handleEmailChange}
                                className={styles.inputField}
                            />
                            {error && <span className={styles.errorText}>{error}</span>}
                            <button onClick={handleSendOTP} className={styles.saveButton} disabled={sendingOTP}>
                                {sendingOTP ? "Đang gửi OTP..." : "Gửi OTP"}
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOTPChange}
                                className={styles.inputField}
                                placeholder="Nhập OTP"
                            />
                            {error && <span className={styles.errorText}>{error}</span>}
                            <button onClick={handleVerifyOTPAndUpdateEmail} className={styles.saveButton} disabled={verifyingOTP}>
                                {verifyingOTP ? "Đang xác minh..." : "Xác minh OTP"}
                            </button>
                        </>
                    )}
                    <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Hủy</button>
                </div>
            ) : (
                <div className={styles.viewEmail}>
                    <p><h2>Email Của Bạn</h2></p>
                    <p> {email}</p>
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>Sửa</button>
                </div>
            )}
        </div>
    );
};

export default Email;

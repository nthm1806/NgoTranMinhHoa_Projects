import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { register } from "../../service/register";
import Footer from "../Footer/Footer";

const Register = () => {
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        password: "",
        confirmPassword: "",
        DateOfBirth: "",
        BankAccountNumber: "",
        PhoneNumber: "",
        Gender: "0",
        Avatar: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.FirstName || !formData.LastName || !formData.Email || !formData.password || !formData.confirmPassword) {
            return "Vui lòng nhập đầy đủ thông tin!";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            return "Email không hợp lệ!";
        }
        if (formData.password.length < 6) {
            return "Mật khẩu phải có ít nhất 6 ký tự!";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Mật khẩu nhập lại không khớp!";
        }
        if (formData.PhoneNumber && !/^\d{10,11}$/.test(formData.PhoneNumber)) {
            return "Số điện thoại không hợp lệ!";
        }
        if (formData.BankAccountNumber && !/^\d{9,16}$/.test(formData.BankAccountNumber)) {
            return "Số tài khoản ngân hàng không hợp lệ!";
        }

        // Kiểm tra tuổi >= 18
        if (formData.DateOfBirth) {
            const birthYear = new Date(formData.DateOfBirth).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear < 18) {
                return "Bạn phải từ 18 tuổi trở lên!";
            }
        } else {
            return "Vui lòng nhập ngày sinh!";
        }

        return null;
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const response = await register(formData);

            if (response.data.success) {
                setSuccess("Đăng ký thành công!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(response.data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            setError("Lỗi kết nối đến server!");
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerBox}>
                <h1>Đăng ký</h1>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <form onSubmit={handleRegister} className={styles.form}>
                    <input type="text" name="FirstName" placeholder="Họ" value={formData.FirstName} onChange={handleChange} required className={styles.input} />
                    <input type="text" name="LastName" placeholder="Tên" value={formData.LastName} onChange={handleChange} required className={styles.input} />
                    <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} required className={styles.input} />
                    <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} className={styles.input} />
                    <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required className={styles.input} />
                    <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} required className={styles.input} />
                    <input type="text" name="PhoneNumber" placeholder="Số điện thoại" value={formData.PhoneNumber} onChange={handleChange} className={styles.input} />
                    <select name="Gender" value={formData.Gender} onChange={handleChange} className={styles.input}>
                        <option value="0">Nam</option>
                        <option value="1">Nữ</option>
                    </select>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                    <button type="button" className={styles.loginButton} onClick={() => navigate("/login")}>
                        Quay lại Đăng nhập
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;

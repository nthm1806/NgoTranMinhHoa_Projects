import { useState } from "react";
import { useAuth } from "../../globalContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(email, password);
        console.log(result)
        if (result.success) {
            navigate("/"); // Chuyển hướng về trang chủ sau khi đăng nhập
        } else {
            setError(result.message); // Hiển thị lỗi nếu đăng nhập thất bại
        }
    };


    const handleLogout = () => {
        try {
            logout();
            navigate("/"); 
            console.log("Logout Success: ");
        } catch (error) {
            setError("Logout Error");
        }
    };
    

    return (
        <div>
            <h1>Đăng nhập</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
            <button onClick={() => handleLogout()}>Logout</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;

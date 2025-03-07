import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

// URL API của Backend
const API_URL = "http://localhost:3001/customers";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [inforFullUser, setInforFullUser] = useState(null);
    const [customerID, setCustomerID] = useState(""); // ✅ Thêm state để lưu customerID

    // Lấy danh sách Customers từ Backend khi ứng dụng khởi chạy
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(API_URL);
                setCustomers(response.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách Customers:", error);
            }
        };

        fetchCustomers();

        // Kiểm tra trạng thái đăng nhập từ localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setInforFullUser(parsedUser)
            setInforFullUser(parsedUser);
            setCustomerID(parsedUser.id); 
        }
    }, []);

    const login = (email, password) => {
        
        const foundUser = customers.find(user => user.Email === email && user.password === password);
        
        if (foundUser) {
            const userData = { 
                id: foundUser.CustomerID, 
                name: `${foundUser.FirstName} ${foundUser.LastName}`, 
                email: foundUser.Email,
                avatar: foundUser.Avatar
            };

            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setInforFullUser(foundUser);
            setCustomerID(foundUser.CustomerID); // ✅ Cập nhật customerID ngay khi đăng nhập

            return { success: true, message: "Đăng nhập thành công!" };
        } else {
            return { success: false, message: "Email hoặc mật khẩu không chính xác!" };
        }
    };

    // ✅ Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setCustomerID(""); // ✅ Reset customerID khi logout
        setInforFullUser("");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, customerID, inforFullUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Export hook useAuth
export const useAuth = () => useContext(AuthContext);
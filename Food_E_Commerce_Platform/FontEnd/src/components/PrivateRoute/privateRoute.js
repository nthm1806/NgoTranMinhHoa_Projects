// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate(); // Hook điều hướng

//     const handleLogout = () => {
//         logout(); // Gọi hàm logout từ AuthContext
//         navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
//     };

//     return (
//         <nav>
//             <Link to="/">Trang Chủ</Link>
//             {user ? (
//                 <>
//                     <Link to="/OrderCheckOut">Thanh Toán</Link>
//                     <button onClick={handleLogout}>Đăng Xuất</button>
//                 </>
//             ) : (
//                 <Link to="/login">Đăng Nhập</Link>
//             )}
//         </nav>
//     );
// };

// export default Navbar;

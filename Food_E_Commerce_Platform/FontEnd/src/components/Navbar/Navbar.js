import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            {user ? (
                <>
                    <Link to="/OrderCheckOut"></Link>
                    <button onClick={logout}>Đăng Xuất</button>
                </>
            ) : (
                <Link to="/login"></Link>
            )}
        </nav>
    );
};

export default Navbar;

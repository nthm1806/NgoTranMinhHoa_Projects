import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth} from "../globalContext/AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { customerID } = useAuth();

    const fetchCartCount = async () => {
        try {
            if (!customerID) {
                setCartCount(0);
                return;
            }

            const response = await axios.post("http://localhost:3001/api/Cart/cusID", {
                cusID: customerID,
            });

            if (Array.isArray(response.data)) {
                const cartItems = response.data.length;
                setCartCount(cartItems);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, [customerID]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
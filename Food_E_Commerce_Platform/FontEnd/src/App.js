import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portal from "./router/Portal/Portal.js";
import Order from "./router/Order/Order.js";
import Home from "./router/Home/Home";
import Cart from "./router/Cart/Cart.js";
import Shop from "./router/Shop/Shop.js";
import SearchProduct from "./router/products/SearchProducts";

import OrderandVoucher from "./router/OrderandVoucher/OrderandVoucher.js";
import Notification from "./router/Notification/Notification.js";
import Login from "./layout/Login/Login.js";
import CustomerRoutes from "./router/Profile/CustomerRoutes";
import Category from "./router/Portal/Category/Category.js";
import React, { useContext } from "react";
import { GlobalProvider } from "./globalContext/GlobalContext";
import { AuthProvider } from "./globalContext/AuthContext.js";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext.js";
import MenuHeaderProvider from "./globalContext/MenuHeaderContext.js";
import DarkModeButton from "./components/DarkModeButton";
import ShopProvider from "./globalContext/ShopContext.js";
import FavoriteProduct from "./router/products/FavoriteProducts.jsx";
import { PageProductDetail } from "./components/products/ProductDetail.jsx";
import SearchResults from "./router/Portal/SearchResults/SearchResults.js";
import ActivityLog from "./router/Profile/ActivityLog.jsx";
import { NewComboProduct } from "./router/Combo/NewComboProduct.jsx";
import { ListComboProduct } from "./router/Combo/ListComboProduct.jsx";
import OrderDetail from './router/OrderDetail/OrderDetail'
import SupportRequest from "./router/Portal/SupportForm/SupportRequest/SupportRequest.js";
import SupportHistory from "./router/Portal/SupportForm/SupportHistory/SupportHistory.js";
import SupportRequestDetails from "./router/Portal/SupportForm/SupportRequestDetails/SupportRequestDetails.js";
import "./i18n.js";


function AppContent() {
  const { theme } = useContext(ThemeContext);

  
  return (
    <div
      className={`min-h-screen transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      <header className="p-4 flex justify-between items-center">
        <DarkModeButton />
      </header>

      <Routes>
        <Route path="/OrderCheckOut" element={<Order />} />
        <Route path="/OrderandVoucher" element={<OrderandVoucher />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/my-favorite" element={<FavoriteProduct />} />
        <Route path="/product/:id" element={<PageProductDetail />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Notifications" element={<Notification />} />
        <Route path="customers/*" element={<CustomerRoutes />} />
        <Route path="/customers/activity-log" element={<ActivityLog />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Portal" element={<Portal />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/searchPortal" element={<SearchResults />} />
        <Route path="/category/:category/:itemId" element={<Category />} />
        <Route path="/new-combo" element={<NewComboProduct />} />
        <Route path="/list-combo" element={<ListComboProduct />} />
        <Route path="/OrderDetail/:orderDetailID" element={<OrderDetail />} />
        <Route path="/support/request" element={<SupportRequest />} />
        <Route path="/support/history" element={<SupportHistory />} />
        <Route path="/support/history/:id" element={<SupportRequestDetails />} />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <MenuHeaderProvider>
          <ShopProvider>
            <ThemeProvider>
              <Router>
                <AppContent />
              </Router>
            </ThemeProvider>
          </ShopProvider>
        </MenuHeaderProvider>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;

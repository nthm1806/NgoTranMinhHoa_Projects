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
import CustomerBehaviorProvider from "./globalContext/CustomerBehaviorContext.js";
import MenuHeaderProvider from "./globalContext/MenuHeaderContext.js";
import ShopProvider from "./globalContext/ShopContext.js";
import FavoriteProduct from "./router/products/FavoriteProducts.jsx";
import { PageProductDetail } from "./components/products/ProductDetail.jsx";
import SearchResults from "./router/Portal/SearchResults/SearchResults.js";
import ActivityLog from "./router/Profile/ActivityLog.jsx";
import { NewComboProduct } from "./router/Combo/NewComboProduct.jsx";
import { ListComboProduct } from "./router/Combo/ListComboProduct.jsx";
import OrderDetail from "./router/OrderDetail/OrderDetail";
import Bills from "./router/Bills/Bills.js";
import TransactionHistory from "./router/TransactionHistory/TransactionHistory.js";
import SupportRequest from "./router/Portal/SupportForm/SupportRequest/SupportRequest.js";
import SupportHistory from "./router/Portal/SupportForm/SupportHistory/SupportHistory.js";
import BlogList from "./router/Blog/Blog.js";
import BlogDetail from "./router/Blog/BlogDetail.js";
import CreateBlog from "./router/Blog/CreateBlog.js";
import UpdateBlog from "./router/Blog/UpdateBlog.js";
import MyBlog from "./router/Blog/MyBlog.js";
import ContactInfo from "./layout/ContactInfo/ContactInfo.js";
import SupportRequestDetails from "./router/Portal/SupportForm/SupportRequestDetails/SupportRequestDetails.js";
import "./i18n.js";
import { Policy } from "./router/Policy/Policy.jsx";
import Video from "./router/Video/Video.js";
import LoyaltyPage from "./router/LoyaltyStatus/LoyaltyPage.js";
import LoyaltyHistoryPage from "./router/LoyaltyStatus/LoyaltyHistoryPage/LoyaltyHistoryPage.js";
import AffiliatePage from "./router/AffiliatePage/AffiliatePage.js";
import { CartProvider } from "./globalContext/CartContext.js";
import Gift from "./router/GiftShop/Gift.js";
import Game from "./router/Game/Game.jsx";
import { RecentProducts } from "./components/products/RecentProduct.jsx";
import Register from "./layout/Login/Register.jsx";

// 🛠️ HÀM AppContent() - Định nghĩa nội dung ứng dụng
function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      <header
        style={{ position: "absolute" }}
        className="p-4 flex justify-between items-center"
      ></header>

      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/OrderCheckOut" element={<Order />} />
        <Route path="/TransactionHistory" element={<TransactionHistory />} />
        <Route path="/Bills" element={<Bills />} />
        <Route path="/OrderandVoucher" element={<OrderandVoucher />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/blog/add" element={<CreateBlog />} />
        <Route path="/blog/update/:id" element={<UpdateBlog />} />
        <Route path="/blog/myblog" element={<MyBlog />} />
        <Route path="/contact" element={<ContactInfo />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/my-favorite" element={<FavoriteProduct />} />
        <Route path="/product/:id" element={<PageProductDetail />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Notifications" element={<Notification />} />
        <Route path="customers/*" element={<CustomerRoutes />} />
        <Route path="/customers/activity-log" element={<ActivityLog />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Portal/:customerId" element={<Portal />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/searchPortal" element={<SearchResults />} />
        <Route path="/category/:category/:itemId" element={<Category />} />
        <Route path="/new-combo" element={<NewComboProduct />} />
        <Route path="/list-combo" element={<ListComboProduct />} />
        <Route path="/OrderDetail/:orderDetailID" element={<OrderDetail />} />
        <Route path="/support/request/:customerId" element={<SupportRequest />} />
        <Route path="/support/history/:customerId" element={<SupportHistory />} />

        <Route path="/register" element={<Register />} />
        <Route path="/support/history/:customerId/:id" element={<SupportRequestDetails />} />
        <Route path="/policy" element={<Policy />} />

        <Route path="/video/*" element={<Video />} />
        <Route path="/loyalty/:customerId" element={<LoyaltyPage />} />
        <Route
          path="/loyalty-history/:customerId"
          element={<LoyaltyHistoryPage />}
        />
        <Route path="/affiliate/:customerId" element={<AffiliatePage />} />
        <Route path="/gift" element={<Gift />} />
        <Route path="/game" element={<Game />} />
        <Route path="/recent-products" element={<RecentProducts />} />
      </Routes>
    </div>
  );
}

// 🛠️ HÀM App() - Bọc ứng dụng với các Context Providers
function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <MenuHeaderProvider>
          <ShopProvider>
            <ThemeProvider>
              <Router>
                <CustomerBehaviorProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </CustomerBehaviorProvider>
              </Router>
            </ThemeProvider>
          </ShopProvider>
        </MenuHeaderProvider>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;

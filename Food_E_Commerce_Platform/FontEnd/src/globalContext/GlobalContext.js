import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../globalContext/AuthContext"; // ✅ Import useAuth

// Tạo context
export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [categoryList, setCategoryList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [inforShopList, setInforShopList] = useState([]);
  const [voucherShopList, setVoucherShopList] = useState([]);
  const [listVoucherByCustomerID, setListVoucherByCustomerID] = useState([]);
  const [productShopSuggestList, setProductShopSuggestList] = useState([]);
  const [listCustomerShopFollow, setListCustomerShopFollow] = useState([]);
  const [optionMain, setOptionMain] = useState("Tất Cả");
  const [categoryProductByShopID, setCategoryProductByShopID] = useState([]);
  const [productListMain, setProductListMain] = useState([]);
  const [typeNotification, setTypeNotification] = useState("Tất Cả Thông Báo");
  const [statusNotification, setStatusNotification] = useState("unread");
  const [order_ID, setOrder_ID] = useState("");
  const [voucher_ID, setVoucher_ID] = useState("");
  const [menuDataLoadedMain, setMenuDataLoadedMain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopID, setShopID] = useState("1");
  const [productFavoriteList, setProductFavoriteList] = useState([]);

  const { customerID } = useAuth() || {}; // ✅ Nhận customerID từ AuthContext

  // ✅ Hàm gọi API danh mục sản phẩm
  const fetchCategories = async () => {
    setMenuDataLoadedMain(false);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/Category"
      );
      setCategoryList(response.data[0]);
      setMenuDataLoadedMain(true);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  //List Customer follow shop
  const fetchListCustomerShopFollow = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/CustomerShopFollow/ListCustomerShopFollow",
        {
          params: {
            customerID: customerID,
          },
        }
      );
      setListCustomerShopFollow(response.data.data);
      console.log("Lấy List follow thành công:", response.data.data);
    } catch (error) {
      console.error("Lỗi khi Lấy List follow:", error);
    }
  };

  useEffect(() => {
    if (customerID) {
      fetchListCustomerShopFollow(customerID);
    }
  }, [customerID]);

  //Lấy tất cả các Voucher của User
  const fetchListVoucherByCustomerID = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/VoucherDetail/ListVoucherByCustomerID",
        {
          params: { customerID: customerID },
        }
      );
      setListVoucherByCustomerID(response.data.data);
      console.log("Danh sách Voucher của user: ", response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    if (customerID) {
      fetchListVoucherByCustomerID(customerID);
    }
  }, [customerID]);

  //Lấy tất cả các sản phẩm mà User yêu thích
  const fetchProductFavorite = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/ProductFavorite/AllList",
        {
          params: { customerID: customerID },
        }
      );
      setProductFavoriteList(response.data.data);
      console.log("Danh sách sản phẩm yêu thích: ", response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    if (customerID) {
      fetchProductFavorite(customerID);
    }
  }, [customerID]);

  // lấy category product của shop theo ShopID
  const fetchCategoryProductByShopID = async (shopID) => {
    setMenuDataLoadedMain(false);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/Shop",
        {
          params: { shopID },
        }
      );
      setCategoryProductByShopID(response.data);
      setMenuDataLoadedMain(true);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  // ✅ Sửa lỗi thiếu dấu `}`
  const fetchInforShopList = async (shopID) => {
    try {
      const response = await axios.get("http://localhost:3001/api/shop/", {
        params: { shopID },
      });
      if (response.data && response.data.length > 0) {
        setInforShopList(response.data[0]); // ✅ Chỉ cập nhật state nếu có dữ liệu
      } else {
        setInforShopList([]); // ✅ Đặt rỗng nếu không có dữ liệu
        console.warn("Không có dữ liệu cửa hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } // ✅ ĐÃ THÊM DẤU ĐÓNG NGOẶC
  };

  const fetchProductShopSuggestList = async (shopID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/Shop/Suggest",
        {
          params: { shopID },
        }
      );
      if (response.data && response.data.length > 0) {
        setProductShopSuggestList(response.data); 
      } else {
        setProductShopSuggestList([]); 
        console.warn("Không có dữ liệu cửa hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  //Lấy Product của shop phần gợi ý
  const fetchVoucherShopList = async (shopID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Voucher/shop",
        {
          params: { shopID },
        }
      );
      if (response.data && response.data.length > 0) {
        setVoucherShopList(response.data); 
      } else {
        setVoucherShopList([]);
        console.warn("Không có dữ liệu cửa hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } 
  };

  // ✅ Hàm gọi API sản phẩm theo `option`
  const fetchProductsMain = async (optionMain) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/All",
        {
          params: { option: optionMain },
        }
      );
      setProductListMain(response.data[0]);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
    setLoading(false);
  };

  // ✅ Hàm gọi API sản phẩm theo `option` và `type`
  const fetchStatusNotification = async (
    order_ID,
    customerID,
    voucher_ID,
    statusNotification
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/notifications/status",
        {
          params: { order_ID: order_ID, customerID: customerID, voucher_ID: voucher_ID, statusNotification: statusNotification },
        }
      );
      console.log("Status Notifi: ", response.data);
      setNotificationsList(response.data[0]);
    } catch (error) {
      console.error("Lỗi khi tải status sản phẩm:", error);
    }
    setLoading(false);
  };
  console.log("Hehe: ", order_ID,
    customerID,
    voucher_ID,
    statusNotification);

  // ✅ Hàm gọi API Notifications theo customerID
  const fetchNotifications = async (customerID, typeNotification) => {
    if (!customerID) {
      setNotificationsList([]); // Nếu không có customerID, đặt notifications rỗng
      return;
    }
    setLoading(true);
    
    try {
      
      const response = await axios.get(
        "http://localhost:3001/api/notifications",
        {
          params: { customerID:  customerID, typeNotification: typeNotification },
        }
      );
      console.log("Length Notifi: ", response.data[0]);
      setNotificationsList(response.data);

    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
    setLoading(false);
  };

  // ✅ Gọi API danh mục khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (shopID) {
      fetchInforShopList(shopID);
      fetchVoucherShopList(shopID);
      fetchProductShopSuggestList(shopID);
      fetchCategoryProductByShopID(shopID);
    }
  }, [shopID]); // ✅ Gọi lại API khi shopID thay đổi

  // ✅ Gọi API Notifications khi customerID thay đổi (tự động cập nhật khi đăng nhập)
  useEffect(() => {
    if (customerID && typeNotification) { // ✅ Đảm bảo có customerID trước khi gọi API
        fetchNotifications(customerID, typeNotification);
    }
  }, [customerID, typeNotification]);
  
  useEffect(() => {
    if (customerID && order_ID && voucher_ID && statusNotification) { // ✅ Đảm bảo có customerID trước khi gọi API
        fetchStatusNotification(order_ID, customerID, voucher_ID, statusNotification);
    }
  }, [customerID, statusNotification, order_ID, voucher_ID]);

  // ✅ Gọi API sản phẩm khi `option` thay đổi
  useEffect(() => {
    fetchProductsMain(optionMain);
  }, [optionMain]);

  return (
    <GlobalContext.Provider
      value={{
        categoryList,
        menuDataLoadedMain,
        loading,
        notificationsList,
        typeNotification,
        setTypeNotification,
        setStatusNotification,
        statusNotification,
        order_ID,
        setOrder_ID,
        voucher_ID,
        setVoucher_ID,
        setOptionMain,
        optionMain,
        productListMain,
        setProductListMain,
        inforShopList,
        shopID,
        setShopID,
        voucherShopList,
        productShopSuggestList,
        categoryProductByShopID,
        productFavoriteList,
        listVoucherByCustomerID,
        listCustomerShopFollow,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
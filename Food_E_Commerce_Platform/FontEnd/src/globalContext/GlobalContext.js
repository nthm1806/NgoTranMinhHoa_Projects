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
  const [billsList, setBillsList] = useState([]);
  const [transactionHistoryList, setTransactionHistoryList] = useState([]);
  const [listVoucherByCustomerID, setListVoucherByCustomerID] = useState([]);
  const [productShopSuggestList, setProductShopSuggestList] = useState([]);
  const [listCustomerShopFollow, setListCustomerShopFollow] = useState([]);
  const [categoryProductByShopID, setCategoryProductByShopID] = useState([]);
  const [productListMain, setProductListMain] = useState([]);
  const [typeNotification, setTypeNotification] = useState("Tất Cả Thông Báo");
  const [statusNotification, setStatusNotification] = useState("unread");
  const [img, setImg] = useState("");
  const [order_ID, setOrder_ID] = useState("");
  const [voucher_ID, setVoucher_ID] = useState("");
  const [menuDataLoadedMain, setMenuDataLoadedMain] = useState(false);
  const [loading, setLoading] = useState(false);

  const [optionMain, setOptionMain] = useState(() => {
    return localStorage.getItem("optionMain") || "Tất Cả";
  });

  const [shopID, setShopID] = useState(() => {
    return localStorage.getItem("shopID") || "1";
  });

  const [typeBill, setTypeBill] = useState(() => {
    return localStorage.getItem("typeBill") || "Order";
  });

  const [typeTransactionHistory, setTypeTransactionHistory] = useState(() => {
    return localStorage.getItem("typeTransactionHistory") || "";
  });

  useEffect(() => {
    localStorage.setItem("optionMain", optionMain);
  }, [optionMain]);

  // Cập nhật localStorage khi shopID thay đổi
  useEffect(() => {
    localStorage.setItem("shopID", shopID);
  }, [shopID]);

  // Cập nhật localStorage khi shopID thay đổi
  useEffect(() => {
    localStorage.setItem("typeBill", typeBill);
  }, [typeBill]);

  useEffect(() => {
    localStorage.setItem("typeTransactionHistory", typeTransactionHistory);
  }, [typeTransactionHistory]);

  const [productFavoriteList, setProductFavoriteList] = useState([]);

  const { customerID } = useAuth() || {}; // ✅ Nhận customerID từ AuthContext

  const fetchNewCategoryCustomerBehavior = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/CustomerBehavior/NewCategory",
        {
          params: {
            customerID: customerID,
          },
        }
      );
      const category = response.data[0].category;
      setOptionMain(category);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchNewCategoryCustomerBehavior(customerID);
  }, [customerID]);

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

  // List TransactionHistory
  const fetchTransactionHistoryList = async (
    customerID,
    typeTransactionHistory
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Payments/All",
        {
          params: {
            customerID: customerID,
            typeTransactionHistory: typeTransactionHistory,
          },
        }
      );
      const flattenedData = response.data.flat(Infinity);

    // Lọc bỏ các đối tượng trùng lặp dựa trên tất cả các trường
    const uniqueData = flattenedData.filter((value, index, self) => {
      return index === self.findIndex((t) => (
        t.order_id === value.order_id &&
        t.payment_amountOrder === value.payment_amountOrder &&
        t.payment_method === value.payment_method &&
        t.payment_date === value.payment_date &&
        t.status === value.status &&
        t.customer_id === value.customer_id &&
        t.img === value.img 
      ));
    });

    const sortedBills = [...uniqueData].sort(
      (a, b) =>
        new Date(b.payment_date || b.end_date) -
        new Date(a.payment_date || a.end_date)
    );
      setTransactionHistoryList(sortedBills);
    } catch (error) {
      console.error("Lỗi khi Lấy List bills:", error);
    }
  };

  useEffect(() => {
    if (customerID && typeTransactionHistory) {
      fetchTransactionHistoryList(customerID, typeTransactionHistory);
    }
  }, [customerID, typeTransactionHistory]);

  // List Bills
  const fetchBillsList = async (customerID, typeBill) => {
    try {
      const response = await axios.get("http://localhost:3001/api/Bills/All", {
        params: {
          customerID: customerID,
          typeBill: typeBill,
        },
      });
      setBillsList(response.data);
      console.log("Lấy type bills:", typeBill);
      console.log("Lấy List bills:", response.data);
    } catch (error) {
      console.error("Lỗi khi Lấy List bills:", error);
    }
  };

  useEffect(() => {
    if (customerID && typeBill) {
      fetchBillsList(customerID, typeBill);
    }
  }, [customerID, typeBill]);

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
    img,
    statusNotification
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/notifications/status",
        {
          params: {
            order_ID: order_ID,
            customerID: customerID,
            voucher_ID: voucher_ID,
            img: img,
            statusNotification: statusNotification,
          },
        }
      );
      setNotificationsList(response.data[0]);
    } catch (error) {
      console.error("Lỗi khi tải status sản phẩm:", error);
    }
    setLoading(false);
  };
  // ✅ Hàm gọi API Notifications theo customerID
  const fetchNotifications = async (customerID, typeNotification) => {
    if (!customerID) {
      setNotificationsList([]); // Nếu không có customerID, đặt notifications rỗng
      return;
    }
    setLoading(true);

    try {
      if (typeNotification === "Tất Cả Thông Báo") {
        const response1 = await axios.get(
          "http://localhost:3001/api/notifications",
          {
            params: {
              customerID: customerID,
              typeNotification: "Cập Nhật Đơn Hàng",
            },
          }
        );
        const response2 = await axios.get(
          "http://localhost:3001/api/notifications",
          {
            params: { customerID: customerID, typeNotification: "Khuyến Mãi" },
          }
        );
        // Kết hợp và sắp xếp các thông báo
        const mergedList = [...response1.data, ...response2.data];

        const sortedList = mergedList.sort((a, b) => {
          // Lấy thời gian hiện tại (hôm nay)
          const today = new Date();

          // Chuyển đổi DeliveryTime và StartDate thành đối tượng Date, nếu có
          const dateA = a.DeliveryTime
            ? new Date(a.DeliveryTime)
            : new Date(a.StartDate);
          const dateB = b.DeliveryTime
            ? new Date(b.DeliveryTime)
            : new Date(b.StartDate);

          // Tính khoảng cách thời gian từ "hôm nay" tới từng thời gian
          const diffA = Math.abs(today - dateA); // Chênh lệch giữa hôm nay và thời gian của a
          const diffB = Math.abs(today - dateB); // Chênh lệch giữa hôm nay và thời gian của b

          // So sánh chênh lệch: mục nào có thời gian gần hôm nay hơn sẽ đứng trước
          return diffA - diffB;
        });

        setNotificationsList(sortedList);
      } else {
        const response = await axios.get(
          "http://localhost:3001/api/notifications",
          {
            params: {
              customerID: customerID,
              typeNotification: typeNotification,
            },
          }
        );
        setNotificationsList(response.data);
      }
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
    if (customerID && typeNotification) {
      // ✅ Đảm bảo có customerID trước khi gọi API
      fetchNotifications(customerID, typeNotification);
    }
  }, [customerID, typeNotification]);

  useEffect(() => {
    if (customerID && img && (order_ID || voucher_ID) && statusNotification) {
      // ✅ Đảm bảo có customerID trước khi gọi API
      fetchStatusNotification(
        order_ID,
        customerID,
        voucher_ID,
        img,
        statusNotification
      );
    }
  }, [customerID, statusNotification, order_ID, voucher_ID, img]);

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
        billsList,
        setTypeBill,
        transactionHistoryList,
        setTypeTransactionHistory,
        setNotificationsList,
        setImg,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

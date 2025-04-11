import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "./GlobalContext";
import { useAuth } from "./AuthContext";
export const ShopContext = createContext();

function ShopProvider({ children }) {
  const [typeCategory, setTypeCategory] = useState("Đồ Ăn");
  const [optionProductShop, setOptionProductShop] = useState("Phổ Biến");
  const [productShopList, setProductShopList] = useState([]);
  const [productBehaviorShop, setProductBehaviorShop] = useState([]);
  const [followedShopsProducts, setFollowedShopsProducts] = useState([]);
  const [behaviorCustomerProducts, setBehaviorCustomerProducts] = useState([]);
  const { shopID } = useContext(GlobalContext);
  const {customerID} = useAuth();

  const fetchProductShop = async (typeCategory, optionProductShop, shopID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/All/Shop",
        {
          params: {
            type: typeCategory,
            option: optionProductShop,
            shopID: shopID,
          },
        }
      );
      setProductShopList(response.data[0]);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  // ✅ Gọi API sản phẩm khi `option` hoặc `type` thay đổi
  useEffect(() => {
    if (shopID) {
      fetchProductShop(typeCategory, optionProductShop, shopID);
    }
  }, [typeCategory, optionProductShop, shopID]);


  //Lấy những sản phẩm gợi ý theo shopID
  const fetchProductBehaviorShop = async (customerID, shopID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/Behavior/Shop",
        {
          params: {
            customerID: customerID,
            shopID: shopID,
          },
        }
      );
          // Trộn mảng ngẫu nhiên bằng cách sử dụng .sort() và Math.random()
    const randomData = response.data.sort(() => Math.random() - 0.5);
    setProductBehaviorShop(randomData);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    if(customerID && shopID){
      fetchProductBehaviorShop(customerID, shopID);
    }
  },[customerID, shopID]);


  const fetchFollowedShopsProducts  = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/FollowedShops",
        {
          params: {
            customerID: customerID,
          },
        }
      );
    const randomData = response.data.sort(() => Math.random() - 0.5);
    setFollowedShopsProducts(randomData);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const fetchBehaviorCustomerProducts  = async (customerID) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/BehaviorCustomer",
        {
          params: {
            customerID: customerID,
          },
        }
      );
    const randomData = response.data.sort(() => Math.random() - 0.5);
    setBehaviorCustomerProducts(randomData);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  
  useEffect (() => {
    if(customerID){
      fetchFollowedShopsProducts(customerID);
      fetchBehaviorCustomerProducts(customerID);
    }
  },[customerID])

  return (
    <ShopContext.Provider
      value={{
        typeCategory,
        setTypeCategory,
        optionProductShop,
        setOptionProductShop,
        productShopList,
        productBehaviorShop,
        followedShopsProducts,
        behaviorCustomerProducts
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export default ShopProvider;

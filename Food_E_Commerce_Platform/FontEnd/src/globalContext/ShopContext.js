import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "./GlobalContext";
export const ShopContext = createContext();

function ShopProvider({ children }) {
  const [typeCategory, setTypeCategory] = useState("Đồ Ăn");
  const [optionProductShop, setOptionProductShop] = useState("Phổ Biến");
  const [productShopList, setProductShopList] = useState([]);
  const { shopID } = useContext(GlobalContext);

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
      console.log("Danh scahs PRODUCT SHOP: ", response.data);
      setProductShopList(response.data[0]);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  // ✅ Gọi API sản phẩm khi `option` hoặc `type` thay đổi
  useEffect(() => {
    console.log("⚡ ShopContext: Giá trị shopID thay đổi:", shopID);
    if (shopID) {
      fetchProductShop(typeCategory, optionProductShop, shopID);
    }
  }, [typeCategory, optionProductShop, shopID]);

  return (
    <ShopContext.Provider
      value={{
        typeCategory,
        setTypeCategory,
        optionProductShop,
        setOptionProductShop,
        productShopList,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export default ShopProvider;

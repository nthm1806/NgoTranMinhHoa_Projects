import { useState, useEffect, createContext } from "react";
import axios from "axios";
export const MenuHeaderContext = createContext();
function MenuHeaderProvider({children}) {
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [option, setOption] = useState("Tất Cả");
  const [type, setType] = useState("Mới Nhất");
  const [menuDataLoaded, setMenuDataLoaded] = useState(false);

  // ✅ Hàm gọi API sản phẩm theo `option` và `type`
  const fetchProducts = async (selectedOption, selectedType) => {
    setMenuDataLoaded(false);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/Products/All/New",
        {
          params: { option: selectedOption, type: selectedType },
        }
      );
      setProductList(response.data[0]);
      setMenuDataLoaded(true);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  // ✅ Gọi API sản phẩm khi `option` hoặc `type` thay đổi
  useEffect(() => {
    fetchProducts(option, type);
  }, [option, type]);

  return (
    <MenuHeaderContext.Provider
      value={{
        setCategoryList,
        setOption,
        setProductList,
        setType,
        menuDataLoaded,
        setMenuDataLoaded,
        option,
        type,
        productList,
        categoryList,
        fetchProducts
      }}
    >
      {children}
    </MenuHeaderContext.Provider>
  );
}

export default MenuHeaderProvider;

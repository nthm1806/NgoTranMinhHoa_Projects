
import { createContext } from "react";
import axios from "axios";
export const CustomerBehaviorContext = createContext();

function CustomerBehaviorProvider({children}) {
    const fetchAddCustomerBehavior= async (customerID, productID, category, type, shopID) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/api/CustomerBehavior",
            {
                customerID: customerID,
                productID: productID,
                category: category,
                type: type,
                shopID: shopID
            }
          );
          console.log("Add Behavior Thành Công", response.data);
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm:", error);
        }
      };
    return ( 
        <CustomerBehaviorContext.Provider
        value={{fetchAddCustomerBehavior}}
        >
          {children}
        </CustomerBehaviorContext.Provider>
     );
}

export default CustomerBehaviorProvider;
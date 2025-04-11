const pool = require("../config/Database");

const CustomerBehaviorModel = {
  addCustomerBehavior: async (cusID, productID, category, type, shopID) => {
    if (cusID) {

      const payment_date = new Date();
      const options = {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted_date = new Intl.DateTimeFormat("en-GB", options).format(payment_date).replace(",", "");
      const formatted_result = formatted_date.replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/, "$3-$2-$1 $4:$5:$6");  

      const query = `
      INSERT INTO CustomerBehavior (customer_id, product_id, category, action_type, created_at, shop_ID) 
      VALUES (?, ?, ?, ?, '${formatted_result}', ?)
  `;

      const result = await pool.query(query, [
        cusID,
        productID,
        category,
        type,
        shopID,
      ]);
      return result[0]; // Trả về kết quả của query
    }
  },

  getCategoryByShop: async (customerID, shopID) => {
    try {
      if (!customerID) {
        return [];
      } else {
        let result = await pool.query(
          `SELECT distinct category
           FROM CustomerBehavior
           WHERE customer_id = ? AND shop_ID = ?`,
          [customerID, shopID]
        );

        if (result[0].length === 0) {
          result = await pool.query(
            `SELECT distinct category
FROM CustomerBehavior
WHERE customer_id = ? 
`,
            [customerID]
          );
          return result[0];
        }
        return result[0];
      }
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  },

  getCustomerFollowedShops: async (customerID) => {
    if (customerID) {
      try {
        let result = await pool.query(
          `SELECT distinct shop_ID
           FROM CustomerBehavior
           WHERE customer_id = ?`,
          [customerID]
        );

        if (result[0].length === 0) {
          result = await pool.query(
            `SELECT shop_ID
  FROM CustomerBehavior
  GROUP BY shop_ID
  ORDER BY COUNT(shop_ID) DESC
  LIMIT 3;
  `
          );
          return result[0]; // Trả về kết quả
        }
        return result[0];
      } catch (error) {
        console.error("Database query failed:", error);
        throw error;
      }
    }
  },

  getBehaviorCustomerProducts: async (customerID) => {
    if (customerID) {
      try {
        let result = await pool.query(
          `SELECT distinct category
           FROM CustomerBehavior
           WHERE customer_id = ?`,
          [customerID]
        );

        if (result[0].length === 0) {
          result = await pool.query(
            `SELECT category
  FROM CustomerBehavior
  GROUP BY category
  ORDER BY COUNT(category) DESC
  LIMIT 3;
  `
          );
          return result[0];
        }
        return result[0];
      } catch (error) {
        console.error("Database query failed:", error);
        throw error;
      }
    }
  },

  getNewCategory: async (customerID) => {
    if (customerID) {
      try {
        const result = await pool.query(
          `SELECT category
           FROM CustomerBehavior
           WHERE id = (
             SELECT MAX(id)
             FROM CustomerBehavior
             WHERE customer_id = ?
           )`,
          [customerID] // Truyền giá trị customerID vào câu truy vấn
        );

        return result[0]; // Trả về kết quả
      } catch (error) {
        console.error("Database query failed:", error);
        throw error;
      }
    }
  },
};
module.exports = CustomerBehaviorModel;

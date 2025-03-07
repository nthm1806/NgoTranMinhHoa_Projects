const pool = require("../config/Database");
const Products = {
  getProductByShopID:async(ShopID)=>{
    const result = await pool.query('select * from Product where ShopID = ? order by Popularity limit 5',[ShopID]);
    return result[0];
  },
  getAllProductsNew: async (option, type) => {
    if (option === "Tất Cả") {
      if (type === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product ORDER BY ProductID DESC LIMIT 15"
        );
        return result;
      } else if (type === "Rẻ Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product ORDER BY Price ASC LIMIT 15"
        );
        return result;
      } else if (type === "Đắt Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product ORDER BY Price DESC LIMIT 15"
        );
        return result;
      } else if (type === "Bán Chạy Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product ORDER BY SoldQuantity DESC LIMIT 15"
        );
        return result;
      }
    } else if (option === "Đồ Ăn") {
      if (type === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn' ORDER BY ProductID DESC LIMIT 15"
        );
        return result;
      } else if (type === "Rẻ Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn' ORDER BY Price ASC LIMIT 15"
        );
        return result;
      } else if (type === "Đắt Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn' ORDER BY Price DESC LIMIT 15"
        );
        return result;
      } else if (type === "Bán Chạy Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn' ORDER BY SoldQuantity DESC LIMIT 15"
        );
        return result;
      }
    } else if (option === "Đồ Ăn Chay") {
      if (type === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn Chay' ORDER BY ProductID DESC LIMIT 15"
        );
        return result;
      } else if (type === "Rẻ Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn Chay' ORDER BY Price ASC LIMIT 15"
        );
        return result;
      } else if (type === "Đắt Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn Chay' ORDER BY Price DESC LIMIT 15"
        );
        return result;
      } else if (type === "Bán Chạy Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Ăn Chay' ORDER BY SoldQuantity DESC LIMIT 15"
        );
        return result;
      }
    } else if (option === "Đồ Uống") {
      if (type === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Uống' ORDER BY ProductID DESC LIMIT 15"
        );
        return result;
      } else if (type === "Rẻ Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Uống' ORDER BY Price ASC LIMIT 15"
        );
        return result;
      } else if (type === "Đắt Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Uống' ORDER BY Price DESC LIMIT 15"
        );
        return result;
      } else if (type === "Bán Chạy Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Uống' ORDER BY SoldQuantity DESC LIMIT 15"
        );
        return result;
      }
    } else if (option === "Đồ Tươi Sống") {
      if (type === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Tươi Sống' ORDER BY ProductID DESC LIMIT 15"
        );
        return result;
      } else if (type === "Rẻ Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Tươi Sống' ORDER BY Price ASC LIMIT 15"
        );
        return result;
      } else if (type === "Đắt Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Tươi Sống' ORDER BY Price DESC LIMIT 15"
        );
        return result;
      } else if (type === "Bán Chạy Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product Where Category ='Đồ Tươi Sống' ORDER BY SoldQuantity DESC LIMIT 15"
        );
        return result;
      }
    }
  },

  getAllProducts: async (option) => {
    if (option === "Tất Cả") {
      const result = await pool.query("SELECT * FROM Product ORDER BY RAND()");
      return result;
    } else if (option === "Đồ Ăn") {
      const result = await pool.query(
        "SELECT * FROM Product  Where Category ='Đồ Ăn' ORDER BY RAND()"
      );
      return result;
    } else if (option === "Đồ Ăn Chay") {
      const result = await pool.query(
        "SELECT * FROM Product  Where Category ='Đồ Ăn Chay' ORDER BY RAND()"
      );
      return result;
    } else if (option === "Đồ Uống") {
      const result = await pool.query(
        "SELECT * FROM Product  Where Category ='Đồ Uống' ORDER BY RAND()"
      );
      return result;
    } else if (option === "Đồ Tươi Sống") {
      const result = await pool.query(
        "SELECT * FROM Product  Where Category ='Đồ Tươi Sống' ORDER BY RAND()"
      );
      return result;
    }
  },

  getAllCategory: async () => {
    const result = await pool.query("SELECT DISTINCT Category FROM Product");
    return result;
  },

  getProductByProID: async (ProductID) => {
    const result = await pool.query(
      "SELECT * FROM Product WHERE ProductID = ?",
      [ProductID]
    );
    return result[0];
  },
  searchProduct: async (categoryName, pageIndex, keyword) => {
    const pageSize = 12;
    const offset = (pageIndex - 1) * pageSize;

    let whereClause = "";
    let params = [];

    if (categoryName) {
      whereClause = " WHERE Category = ?";
      params.push(categoryName);
    }

    if (keyword) {
      if (whereClause) {
        whereClause += " AND";
      } else {
        whereClause = " WHERE";
      }
      whereClause += " (Category LIKE ? OR ProductName LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const queryDocs = `
        SELECT  p.*, s.ShopName FROM Product p JOIN Shop s ON s.ShopID = p.ShopID
        ${whereClause}
        LIMIT ? OFFSET ?;
    `;

    const queryCount = `
        SELECT COUNT(*) AS total FROM Product
        ${whereClause};
    `;

    params.push(pageSize, offset);

    const [docs, countResult] = await Promise.all([
      pool.query(queryDocs, params),
      pool.query(queryCount, params.slice(0, params.length - 2)),
    ]);

    return {
      docs: docs,
      counts: countResult[0][0].total,
    };
  },

  setProductFavorite: async (CustomerID, ProductID) => {
    const result = await pool.query(
      "INSERT ProductFavorite (CustomerID, ProductID, AddedDate) values (?,?,?)",
      [CustomerID, ProductID, new Date()]
    );

    return result;
  },

  deleteProductFavorite: async (CustomerID, ProductID) => {
    const result = await pool.query(
      "DELETE FROM ProductFavorite WHERE CustomerID = ? AND ProductID = ?",
      [CustomerID, ProductID]
    );

    return result;
  },

  getProductFavorite: async (CustomerID) => {
    const result = await pool.query(
      "SELECT * FROM ProductFavorite WHERE CustomerID = ?",
      [CustomerID]
    );

    return result;
  },

  getProductDetail: async (ProductID) => {
    const result = await pool.query(
      "SELECT * FROM Product p JOIN Shop s ON s.ShopID = p.ShopID WHERE ProductID = ? ",
      [ProductID]
    );
    return result;
  },

  getProductsFavorite: async (CustomerID, pageIndex, keyword) => {
    const pageSize = 12;
    const offset = (pageIndex - 1) * pageSize;

    let whereClause = "";
    let params = [];

    if (CustomerID) {
      whereClause = " WHERE CustomerID = ?";
      params.push(CustomerID);
    }

    if (keyword) {
      if (whereClause) {
        whereClause += " AND";
      } else {
        whereClause = " WHERE";
      }
      whereClause += " (Category LIKE ? OR ProductName LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const queryDocs = `
      SELECT * FROM Product p JOIN ProductFavorite pf ON pf.ProductID = p.ProductID JOIN Shop s ON s.ShopID = p.ShopID
      ${whereClause}
      LIMIT ? OFFSET ?;
  `;

    const queryCount = `
      SELECT COUNT(*) AS total FROM Product p JOIN ProductFavorite pf ON pf.ProductID = p.ProductID 
      ${whereClause};
  `;

    params.push(pageSize, offset);

    const [docs, countResult] = await Promise.all([
      pool.query(queryDocs, params),
      pool.query(queryCount, params.slice(0, params.length - 2)),
    ]);

    return {
      docs: docs,
      counts: countResult[0][0].total,
    };
  },
  getFavoriteByCusID: async (cusID) => {
    const result = await pool.query(
      "select * from Product where ProductID in (select ProductID from ProductFavorite where CustomerID = ?)",
      [cusID]
    );
    return result[0];
  },

  getProductShopSuggest : async (shopID) => {
    const result = await pool.query(
      "select * from Product where ShopID = ? ORDER BY SoldQuantity DESC LIMIT 10;",
      [shopID]
    );
    return result[0];
  },

  getCategoryProductByShopID:  async (shopID) => {
    const result = await pool.query(
      "select distinct Category from Product where ShopID = ?",
      [shopID]
    );
    return result[0];
  },

  getProductShop: async (type, option, shopID) => {
    if (type === "Đồ Ăn") {
      if (option === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn' AND ShopID = ? ORDER BY ProductID DESC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Cao đến Thấp") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn' AND ShopID = ? ORDER BY Price DESC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Thấp đến Cao") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn' AND ShopID = ? ORDER BY Price ASC",
          [shopID]
        );
        return result;
      } else if (option === "Phổ Biến") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn' AND ShopID = ? ORDER BY Popularity DESC",
          [shopID]
        );
        return result;
      }else if (option === "Bán Chạy") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn' AND ShopID = ? ORDER BY SoldQuantity DESC",
          [shopID]
        );
        return result;
      }
    } else if (type === "Đồ Ăn Chay") {
      if (option === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn Chay' AND ShopID = ? ORDER BY ProductID DESC",
          [shopID]
        );
        return result;
      } else if (option === "Phổ Biến") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn Chay' AND ShopID = ? ORDER BY Popularity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Bán Chạy") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn Chay' AND ShopID = ? ORDER BY SoldQuantity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Thấp đến Cao") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn Chay' AND ShopID = ? ORDER BY Price ASC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Cao đến Thấp") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Ăn Chay' AND ShopID = ? ORDER BY Price DESC",
          [shopID]
        );
        return result;
      }
    } else if (type === "Đồ Uống") {
      if (option === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Uống' AND ShopID = ? ORDER BY ProductID DESC",
          [shopID]
        );
        return result;
      } else if (option === "Phổ Biến") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Uống' AND ShopID = ? ORDER BY Popularity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Bán Chạy") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Uống' AND ShopID = ? ORDER BY SoldQuantity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Thấp đến Cao") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Uống' AND ShopID = ? ORDER BY Price ASC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Cao đến Thấp") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Uống' AND ShopID = ? ORDER BY Price DESC",
          [shopID]
        );
        return result;
      }
    } else if (type === "Đồ Tươi Sống") {
      if (option === "Mới Nhất") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Tươi Sống' AND ShopID = ? ORDER BY ProductID DESC",
          [shopID]
        );
        return result;
      } else if (option === "Phổ Biến") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Tươi Sống' AND ShopID = ? ORDER BY Popularity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Bán Chạy") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Tươi Sống' AND ShopID = ? ORDER BY SoldQuantity DESC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Thấp đến Cao") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Tươi Sống' AND ShopID = ? ORDER BY Price ASC",
          [shopID]
        );
        return result;
      } else if (option === "Giá: Cao đến Thấp") {
        const result = await pool.query(
          "SELECT * FROM Product WHERE Category = 'Đồ Tươi Sống' AND ShopID = ? ORDER BY Price DESC",
          [shopID]
        );

        return result;
      }
    }
  },

  checkUserCanComment: async(CustomerID, ProductID)=>{
    const result = await pool.query('SELECT * FROM OrderDetail od JOIN Orders o ON o.OrderID = od.OrderID where o.CustomerID = ? AND ProductID  = ?',[CustomerID, ProductID]);
    return result[0];
  },
   
  getProductByShop: async (ShopID, keyword, type) => {
    let query = `
      SELECT * FROM Product 
      WHERE ShopID = ? 
      AND (ProductName LIKE ? OR Description LIKE ?)
    `;
    
    let params = [ShopID, `%${keyword}%`, `%${keyword}%`];
  
    if (type) {
      query += " AND Category = ?";
      params.push(type);
    }
  
    const result = await pool.query(query, params);
    return result;
  },
};
module.exports = Products;

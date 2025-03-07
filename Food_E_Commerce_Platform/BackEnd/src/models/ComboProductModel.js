const pool = require("../config/Database");

const ComboProduct = {
  
  setComboProduct: async (combo) => {
    const {Price, StockQuantity,Title,Description,ShopID,Discount,DoUong,DoAn} = combo
    const [resultCombo] = await pool.query(
      "INSERT INTO combos (Price, StockQuantity,Title,Description,ShopID,Discount) values (?,?,?,?,?,?)", [Price, StockQuantity,Title,Description,ShopID,Discount]
    );

    const comboID = resultCombo.insertId;;

    const valuesDoAn = DoAn.map(productID => [comboID, productID]);
    const valuesDoUong = DoUong.map(productID => [comboID, productID]);
    
    const sql = "INSERT INTO comboproducts (ComboID, ProductID) VALUES ?";
    
    await Promise.all([
      pool.query(sql, [valuesDoAn]),
      pool.query(sql, [valuesDoUong])

    ]);
    return resultCombo;
  },

  getComboProduct: async(ShopID, keyword, pageIndex) =>{
    const pageSize = 12;
    const offset = (pageIndex - 1) * pageSize;

    let whereClause = "";
    let params = [];

    if (ShopID) {
      whereClause = " WHERE ShopID = ? AND Status = 'Active'";
      params.push(ShopID);
    }

    if (keyword) {
      if (whereClause) {
        whereClause += " AND";
      } else {
        whereClause = " WHERE";
      }
      whereClause += " (Description LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const queryDocs = `
      SELECT * FROM combos 
      ${whereClause}
      LIMIT ? OFFSET ?;
  `;

    const queryCount = `
      SELECT COUNT(*) AS total FROM combos
      ${whereClause};
  `;

    params.push(pageSize, offset);

    const [docs, countResult] = await Promise.all([
      pool.query(queryDocs, params),
      pool.query(queryCount, params.slice(0, params.length - 2)),
    ]);

    // product 
    let whereClause2 = "";
    let params2 = [];

    if (ShopID) {
      whereClause2 = " WHERE c.ShopID = ? ";
      params2.push(ShopID);
    }

    if (keyword) {
      if (whereClause2) {
        whereClause2 += " AND";
      } else {
        whereClause2 = " WHERE";
      }
      whereClause2 += " (p.Description LIKE ? OR p.ProductName LIKE ?)";
      params2.push(`%${keyword}%`, `%${keyword}%`);
    }

    const queryDocs2 = `
      SELECT cp.ComboID, p.* FROM comboproducts cp JOIN Product p  ON p.ProductID = cp.ProductID JOIN combos c ON c.ComboID = cp.ComboID
      ${whereClause2}
  `;


    params2.push(pageSize, offset);
    const [docs2] = await Promise.all([
      pool.query(queryDocs2, params2),
    ]);
    //
    
    const rs = docs[0]?.map(combo =>{
      const products = docs2[0]?.filter(product => product.ComboID === combo.ComboID)
      return ({
        ...combo,
        products
      })
    })

    return {
      docs: rs,
      counts: countResult[0][0].total,
    };
  }
};

module.exports = ComboProduct;

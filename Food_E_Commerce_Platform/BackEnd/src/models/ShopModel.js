const pool = require("../config/Database");

const Shop = {
  getShopListByID:async (shopMain,listShop)=>{
    const result11 = await pool.query('select * from Shop where ShopID  = ?',[shopMain.ShopID]);
    const result = await  Promise.all(listShop.map(async item => {
      const [rows1] = await pool.execute('SELECT * FROM Shop where ShopID = ?', [item]);
      return rows1[0]
  }));
    const result2 = [...result11[0],...result]
    return result2;
  },
  getInforShop: async (req, res) => {
    
    try {
      const shopID = req.query.shopID;

      // ✅ Kiểm tra nếu `shopID` bị thiếu
      if (!shopID) {
        return res.status(400).json({ error: "Thiếu shopID" });
      }

      // ✅ Truy vấn dữ liệu từ MySQL
      const [rows] = await pool.query(`
        SELECT s.*, 
               COUNT(p.ProductID) AS total_products
        FROM Shop s
        LEFT JOIN Product p ON s.ShopID = p.ShopID
        WHERE s.ShopID = ?
        GROUP BY s.ShopID;
    `, [shopID]);
    

      // ✅ Kiểm tra nếu không tìm thấy dữ liệu
      if (rows.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy cửa hàng" });
      }

      // ✅ Trả về dữ liệu đúng format JSON
      return rows;
      

    } catch (error) {
      console.error("Lỗi truy vấn MySQL:", error);
      res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
    }
  },

  getShopByID: async (shopID) => {
    const [rows] = await pool.query(`SELECT ShopName FROM Shop WHERE ShopID = ?`, [shopID]);
    if (rows.length > 0) {
      return rows[0].ShopName;
    } else {
      return null;
    }
  },

  
  getAllShop: async () => {
    const result = await pool.query(
      "SELECT * FROM Shop"
    );

    return result;
  },
};

module.exports = Shop;

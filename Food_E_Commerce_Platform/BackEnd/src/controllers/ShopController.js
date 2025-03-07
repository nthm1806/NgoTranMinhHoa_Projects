const shopService = require('../services/ShopService');

const Shop = {
  getInforShop: async (req, res) => {

    try {
      const shopID = req.query.shopID;
      // Kiểm tra nếu không có shopID
      if (!shopID) {
        return res.status(400).json({ error: "Thiếu shopID trong request" });
      }

      // Gọi service để lấy dữ liệu
      const result = await shopService.getInforShop(req);

      // Kiểm tra nếu không có dữ liệu
      if (result.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy cửa hàng" });
      }

      // Trả kết quả về client
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin shop:", err);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin shop" });
    }
  },
  getAllShop: async (req, res) => {
    try {
      const result = await shopService.getAllShop();      
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = Shop;

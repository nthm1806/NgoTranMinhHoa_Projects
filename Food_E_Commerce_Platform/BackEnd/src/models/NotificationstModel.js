const pool = require("../config/Database");

const Notifications = {
  getAddNotifications: async (OrderInfor, voucher, totalPayment, cusID) => {
    try {
      // Kiểm tra xem thông báo đã tồn tại chưa
      const [existingRows] = await pool.query(
        "SELECT * FROM Notifications WHERE customer_id = ? AND order_id = ? AND voucher_id = ?",
        [cusID, OrderInfor.OrderID, voucher.VoucherID]
      );

      // Nếu thông báo đã tồn tại, không chèn thêm
      if (existingRows.length > 0) {
        return { message: "Notification already exists", data: existingRows };
      }

      // Nếu chưa tồn tại, thực hiện INSERT
      const [result] = await pool.query(
        `INSERT INTO Notifications (customer_id, order_id, voucher_id, status, created_at) 
                 VALUES (?, ?, ?, ?, NOW())`,
        [cusID, OrderInfor.OrderID, voucher.VoucherID, "unread"]
      );

      return {
        message: "Notification inserted successfully",
        insertId: result.insertId,
      };
    } catch (error) {
      console.error("Error inserting notification:", error);
      throw error;
    }
  },

  getAllNotifications: async (customerID, typeNotification) => {
    try {
      if (!customerID) {
        return res.status(400).json({ message: "customerID is required" });
      }
      if (!typeNotification) {
        console.log(typeNotification);
        return res
          .status(400)
          .json({ message: "typeNotification is required" });
      }

      if (typeNotification === "Tất Cả Thông Báo") {
        const [result] = await pool.query(
          `SELECT 
              o.CustomerID,
              o.OrderID,
              od.Status,
              od.DeliveryTime,
              p.ProductImg,
              v.VoucherID,
              v.VoucherImg,
              v.IsActive,
              v.StartDate,
              v.EndDate,
              v.VoucherName,
              v.VoucherTitle,
              n.status as notification_status
              FROM Orders o
              Left JOIN Notifications n ON n.order_id = o.OrderID
              LEFT JOIN OrderDetail od ON o.OrderID = od.OrderID
              LEFT JOIN Product p ON od.ProductID = p.ProductID
              LEFT JOIN VoucherDetail vd ON o.CustomerID = vd.CustomerID
              LEFT JOIN Voucher v ON vd.VoucherID = v.VoucherID
              WHERE o.CustomerID = ?
              GROUP BY o.CustomerID, o.OrderID, od.Status, od.DeliveryTime, v.VoucherID, p.ProductImg, n.status
              ORDER BY od.DeliveryTime DESC
              LIMIT 10;`,
          [customerID]
        );
        return result;
      } else if (typeNotification === "Cập Nhật Đơn Hàng") {
        const [result] = await pool.query(
          `SELECT 
              o.CustomerID,
              o.OrderID,
              od.Status,
              od.DeliveryTime,
              p.ProductImg,
              n.status as notification_status
              FROM Orders o
              Left JOIN Notifications n ON n.order_id = o.OrderID
              LEFT JOIN OrderDetail od ON o.OrderID = od.OrderID
              LEFT JOIN Product p ON od.ProductID = p.ProductID
              WHERE o.CustomerID = ?
              GROUP BY o.CustomerID, o.OrderID, od.Status, od.DeliveryTime,p.ProductImg, n.status
              ORDER BY od.DeliveryTime DESC
              LIMIT 10;`,
          [customerID]
        );
        return result;
      } else if (typeNotification === "Khuyến Mãi") {
        const [result] = await pool.query(
          `SELECT 
              v.VoucherImg,
              v.IsActive,
              vd.CustomerID,
              v.VoucherID,
              v.StartDate,
              v.EndDate,
              v.VoucherName,
              v.VoucherTitle
              FROM VoucherDetail vd
              LEFT JOIN Voucher v ON vd.VoucherID = v.VoucherID
              WHERE vd.CustomerID = ?
              GROUP BY v.VoucherID
              ORDER BY v.StartDate DESC
              LIMIT 10;`,
          [customerID]
        );

        return result;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  getStatusNotifications: async (
    customerID,
    order_ID,
    voucher_ID,
    statusNotification
  ) => {
    try {
      const [result] = await pool.query(
        `UPDATE Notifications
         SET status = ?
         WHERE order_id = ? AND customer_id = ? AND voucher_id = ?;`,
        [statusNotification, order_ID, customerID, voucher_ID]
      );
    } catch (error) {
      console.error("Error status notifications:", error);
      throw error;
    }
  },
  addNotifications: async (cusID, OrderID) => {
    await pool.query(
      "insert into Notifications (customer_id,order_id) values (? ,?)",
      [cusID, OrderID]
    );
  },
};
module.exports = Notifications;

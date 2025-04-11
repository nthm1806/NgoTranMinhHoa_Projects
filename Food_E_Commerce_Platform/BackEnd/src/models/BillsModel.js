const pool = require("../config/Database");

const Bills = {
  getBillsAll: async (customerID, typeBill) => {
    if (typeBill === "Điện") {
      const result = await pool.query(
        "select * from Bills where customer_id = ? and bill_type = ?",
        [customerID, typeBill]
      );
      return result[0];
    } else if (typeBill === "Mạng") {
      const result = await pool.query(
        "select * from Bills where customer_id = ? and bill_type = ?",
        [customerID, typeBill]
      );
      return result[0];
    } else if (typeBill === "Nước") {
      const result = await pool.query(
        "select * from Bills where customer_id = ? and bill_type = ?",
        [customerID, typeBill]
      );
      return result[0];
    }
  },

  getAllBillByBillID : async (bill_id, typeTransactionHistory) => {
    if(typeTransactionHistory === "Điện"){
      const result = await pool.query(
        "select * from Bills where bill_id = ? and bill_type = ?",
        [bill_id, "Điện"]
      );
      return result[0];
    }else  if(typeTransactionHistory === "Nước"){
      const result = await pool.query(
        "select * from Bills where bill_id = ? and bill_type = ?",
        [bill_id, "Nước"]
      );
      return result[0];
    } else if (typeTransactionHistory === "Mạng"){
      const result = await pool.query(
        "select * from Bills where bill_id = ? and bill_type = ?",
        [bill_id, "Mạng"]
      );
      return result[0];
    }
  },

  updateStatusBills : async (bill_id, bill_type) => {
    if(bill_type === "Điện"){
      const result = await pool.query(
        "UPDATE Bills SET status = ? WHERE bill_id = ? and bill_type = ?",
        ["Đã thanh toán", bill_id, "Điện"]
      );
      return result[0];
    }else  if(bill_type === "Nước"){
      
      const result = await pool.query(
        "UPDATE Bills SET status = ? WHERE bill_id = ? and bill_type = ?",
        ["Đã thanh toán", bill_id, "Nước"]
      );
      return result[0];
    } else if (bill_type === "Mạng"){
      const result = await pool.query(
        "UPDATE Bills SET status = ? WHERE bill_id = ? and bill_type = ?",
        ["Đã thanh toán", bill_id, "Mạng"]
      );
      return result[0];
    }
  },
};

module.exports = Bills;

const pool = require("../config/Database");

exports.addCustomer = async (data) => {
  try {
    // Kiểm tra nếu CustomerID đã tồn tại
    const [rows] = await pool.query(
      "SELECT * FROM Customer WHERE CustomerID = ?",
      [data.CustomerID]
    );
    console.log(data.CustomerID);

    if (rows.length === 0) {
      // Thêm khách hàng mới vào database
      await pool.query(`
        INSERT INTO Customer 
        (CustomerID, FirstName, LastName, DateOfBirth, BankAccountNumber, Email, PhoneNumber, Gender, Avatar, Status, password, CreatedAt, UpdatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.CustomerID,
            data.FirstName,
            data.LastName,
            data.DateOfBirth,
            data.BankAccountNumber ? data.BankAccountNumber : null, // Tránh lỗi NULL
            data.Email,
            data.PhoneNumber,
            data.Gender,
            data.Avatar ? data.Avatar : null, // Tránh lỗi nếu thiếu Avatar
            data.Status,
            data.password ? data.password : "defaultPassword", // Tránh lỗi nếu thiếu password
            data.CreatedAt,
            data.UpdatedAt
        ]
    );
          console.log(18);
    }

    return { success: true };
  } catch (error) {
    console.error("Database error:", error.message);
    throw error;
  }
};

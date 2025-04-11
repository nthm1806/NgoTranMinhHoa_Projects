const pool = require("../config/Database");
const Register = {
    addCustomer: async (body) => {
        const {
            FirstName,
            LastName,
            Email,
            password,
            DateOfBirth,
            BankAccountNumber = 0,
            PhoneNumber,
            Gender,
            Avatar = null,
            Xu = 0
        } = body;

        try {
            // Kiểm tra email đã tồn tại chưa
            const [existingCustomer] = await pool.query("SELECT COUNT(*) AS count FROM Customer WHERE Email = ?", [Email]);
            if (existingCustomer[0].count > 0) {
                return { success: false, message: "Email đã tồn tại!" };
            }

            // Kiểm tra tuổi >= 18
            const birthYear = new Date(DateOfBirth).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear < 18) {
                return { success: false, message: "Bạn phải từ 18 tuổi trở lên!" };
            }

            // Nếu BankAccountNumber rỗng, đặt thành NULL
            const bankAccountValue = BankAccountNumber.trim() === "" ? null : BankAccountNumber;

            // Thêm khách hàng mới vào database
            const sql = `
                INSERT INTO Customer
                (FirstName, LastName, Email, password, DateOfBirth, BankAccountNumber, PhoneNumber, Gender, Avatar, Xu) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await pool.query(sql, [FirstName, LastName, Email, password, DateOfBirth, bankAccountValue, PhoneNumber, Gender, Avatar, Xu]);

            return { success: true, message: "Đăng ký thành công!" };
        } catch (error) {
            console.error("Lỗi khi đăng ký tài khoản:", error);
            return { success: false, message: "Lỗi server, vui lòng thử lại sau!" };
        }
    }
};

module.exports = Register;

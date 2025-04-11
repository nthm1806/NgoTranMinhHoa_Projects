const bcrypt = require('bcryptjs'); // Import bcryptjs để mã hóa mật khẩu
const CustomerServices = require("../services/customerService");

const CustomerControllers = {
  getAllCustomers: async (req, res) => {
    try {
      const result = await CustomerServices.getAllCustomers();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const { CustomerID } = req.params;
      const result = await CustomerServices.getCustomerById(CustomerID);

      if (result) {
        const customer = {
          ...result,
          Avatar: result.Avatar
          ? result.Avatar.startsWith("http") // Kiểm tra nếu Avatar đã là URL đầy đủ
            ? result.Avatar
            : `${req.protocol}://${req.get("host")}/uploads/${result.Avatar}`
          : null,        
        };

        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  updateCustomerById: async (req, res) => {
    try {
      const { CustomerID } = req.params;
      const filePath = req.file.path;
      const customerData = req.body;
      const { oldPassword, newPassword } = req.body;

      // Nếu người dùng muốn thay đổi mật khẩu
      if (oldPassword && newPassword) {
        const customer = await CustomerServices.getCustomerById(CustomerID);

        if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
        }

        // So sánh mật khẩu cũ với mật khẩu đã băm trong cơ sở dữ liệu
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
        if (!isOldPasswordCorrect) {
          return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
        }

        // Mã hóa mật khẩu mới
        customerData.password = await bcrypt.hash(newPassword, 10);
      } else {
        // Nếu không thay đổi mật khẩu, giữ nguyên mật khẩu cũ
        customerData.password = req.body.password || customerData.password;
      }

      // Nếu có avatar, cập nhật avatar mới
      if (req.file) {
        customerData.Avatar = req.file.path;
      }

      const result = await CustomerServices.updateCustomerById(CustomerID, customerData);
      res.status(200).json({ message: "Customer updated successfully", result });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = CustomerControllers;

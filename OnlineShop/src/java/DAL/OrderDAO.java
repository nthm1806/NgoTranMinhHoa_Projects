/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Order;
import Model.OrderDetail;
import Model.Product;
import Model.Status;
import Model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class OrderDAO {

    public static OrderDAO INSTANCE = new OrderDAO();
    private Connection con;
    private String status = "OK";

    private OrderDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public void addOrder(int userID, String name, String orderDate, String addressShip, String phone, int statusID, float totalPrice) {
        int needToCreateOrder = 1;
        try {
            String sql = "INSERT INTO Orders (userID, name, order_date, statusID, phone, addressShip, totalMoney,needToCreate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);
            ps.setString(2, name);
            ps.setString(3, orderDate);
            ps.setInt(4, statusID);
            ps.setString(5, phone);
            ps.setString(6, addressShip);
            ps.setFloat(7, totalPrice);
            ps.setInt(8, needToCreateOrder);

            ps.executeUpdate();

        } catch (Exception e) {
            System.out.println("addOrder: " + e.getMessage());
        }

    }

    public Order getOrderNeedToCreateDetail() {
        try {
            String sql = "SELECT * FROM Orders WHERE needToCreate = 1";
            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Order order = new Order();
                order.setOrderID(rs.getInt("orderID"));
                return order;

            }

        } catch (Exception e) {
            System.out.println("searchOrderToCreateDetail: " + e.getMessage());
        }
        return null;

    }

    public boolean addOrderDetail(int orderID, int productID, float price, int quantity) {
        try {
            String sql = "INSERT INTO OrderDetail (orderID, productID, price, quantity) VALUES (?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, orderID);
            ps.setInt(2, productID);
            ps.setFloat(3, price);
            ps.setInt(4, quantity);

            int rowsAffected = ps.executeUpdate();

            // Kiểm tra xem có hàng hóa nào được thêm thành công không
            if (rowsAffected > 0) {
                return true; // Thêm thành công
            } else {
                return false; // Không thêm được
            }
        } catch (Exception e) {
            System.out.println("addOrderDetail: " + e.getMessage());
            return false; // Đã có lỗi xảy ra
        }
    }

    public void updateNeedToCreateDetail(int userID) {
        try {
            // Xây dựng câu lệnh SQL để cập nhật cột needToCreate từ 1 thành 0 trong bảng Orders
            String sql = "UPDATE Orders SET needToCreate = 0 WHERE userID = ? AND needToCreate = 1";

            // Chuẩn bị câu lệnh SQL với PreparedStatement và thiết lập các tham số cho câu lệnh
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);

            // Thực thi câu lệnh SQL sử dụng executeUpdate()
            int rowsAffected = ps.executeUpdate();

            // In ra thông báo sau khi thực hiện câu lệnh SQL
            System.out.println(rowsAffected + " row(s) updated successfully.");

        } catch (Exception e) {
            // Xử lý ngoại lệ nếu có
            System.out.println("updateNeedToCreateDetail: " + e.getMessage());
        }
    }

    public ArrayList<Order> getOrderByUserID(int userID) {
        ArrayList<Order> list = new ArrayList<Order>();
        try {
            String sql = "SELECT O.*, U.userName, U.email, S.statusName\n"
                    + "FROM Orders O\n"
                    + "INNER JOIN Users U ON O.userID = U.userID\n"
                    + "INNER JOIN Status S ON O.statusID = S.statusID\n"
                    + "WHERE O.userID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order o = new Order();
                o.setOrderID(rs.getInt("orderID"));
                User u = new User();
                u.setUserID(userID);
                u.setUserName(rs.getString("userName"));
                o.setUser(u);
                o.setOrder_date(rs.getString("order_date"));
                Status s = new Status();
                s.setStatusID(rs.getInt("statusID"));
                s.setStatusName(rs.getString("statusName"));
                o.setStatus(s);
                o.setAddress(rs.getString("addressShip"));
                o.setPhone(rs.getString("phone"));
                o.setTotalMoney(rs.getFloat("totalMoney"));
                list.add(o);

            }
        } catch (Exception e) {
            System.out.println("getOrderByUserID:" + e.getMessage());
        }
        return list;
    }

    public ArrayList<OrderDetail> getOrderDetailByOrderID(int orderID) {
        ArrayList<OrderDetail> list = new ArrayList<OrderDetail>();
        try {
            String sql = "SELECT OD.*, P.productName, P.productPrice,P.images, O.order_date, O.statusID, O.phone, O.addressShip, O.totalMoney "
                    + "FROM OrderDetail OD "
                    + "INNER JOIN Products P ON OD.productID = P.productID "
                    + "INNER JOIN Orders O ON OD.orderID = O.orderID "
                    + "WHERE OD.orderID = ?"; // Sử dụng dấu ? để làm tham số cho orderID

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, orderID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                OrderDetail od = new OrderDetail();
                od.setOrderDetailID(rs.getInt("orderDetailID"));
                Order o = new Order();
                o.setOrderID(orderID);

                od.setOrder(o);
                od.setPrice(rs.getFloat("price"));
                Product p = new Product();
                p.setProductID(rs.getInt("productID"));
                p.setProductName(rs.getString("productName"));
                p.setImage(rs.getString("images"));
                p.setProductPrice(rs.getFloat("productPrice"));
                od.setProductID(p);
                od.setQuantity(rs.getInt("quantity"));
                list.add(od);

            }
        } catch (Exception e) {
            System.out.println("getOrderDetailByOrderID:" + e.getMessage());
        }
        return list;
    }

    public float getTotalMoneyByOrderID(int orderID) {
        float totalMoney = 0;
        try {
            // Chuỗi SQL để truy vấn tổng tiền từ bảng Orders dựa trên orderID
            String sql = "SELECT totalMoney FROM Orders WHERE orderID = ?";

            // Chuẩn bị câu lệnh SQL với PreparedStatement và thiết lập tham số cho câu lệnh
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, orderID); // Thiết lập tham số cho orderID

            // Thực thi câu lệnh SQL sử dụng executeQuery()
            ResultSet rs = ps.executeQuery();

            // Nếu có kết quả trả về từ truy vấn
            if (rs.next()) {
                totalMoney = rs.getFloat("totalMoney"); // Lấy giá trị totalMoney từ ResultSet
            }

        } catch (Exception e) {
            // Xử lý các ngoại lệ nếu có
            System.out.println("getTotalMoney: " + e.getMessage());
        }
        return totalMoney;
    }

    public ArrayList<Order> getListOrderByIndexPage(int index) {
        ArrayList<Order> orderList = new ArrayList<>();
        try {
            String sql = "SELECT O.*, U.userName,U.email, S.statusName "
                    + "FROM Orders AS O "
                    + "JOIN Users AS U ON O.userID = U.userID "
                    + "JOIN Status AS S ON O.statusID = S.statusID "
                    + "ORDER BY O.orderID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY"; // Thay 10 bằng số lượng đơn hàng bạn muốn lấy trong mỗi trang

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, (index - 1) * 9); // index bắt đầu từ 1, nên cần trừ đi 1 để tính OFFSET

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order order = new Order();
                order.setOrderID(rs.getInt("orderID"));

                order.setOrder_date(rs.getString("order_date"));

                order.setPhone(rs.getString("phone"));
                order.setAddress(rs.getString("addressShip"));
                order.setTotalMoney(rs.getFloat("totalMoney"));

                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                order.setUser(user);

                Status status = new Status();
                status.setStatusID(rs.getInt("statusID"));
                status.setStatusName(rs.getString("statusName"));
                order.setStatus(status);

                orderList.add(order);
            }
        } catch (Exception e) {
            System.out.println("Error getting list of orders: " + e.getMessage());
        }
        return orderList;
    }

    public int getTotalOrder() {
        int total = 0;
        try {
            String sql = "SELECT COUNT(*) AS total FROM Orders";
            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                total = rs.getInt("total");
            }
        } catch (Exception e) {
            System.out.println("Error getting total number of orders: " + e.getMessage());
        }
        return total;
    }

    public ArrayList<Order> getListOrderByStatusPage(int statusId, int index) {
        ArrayList<Order> orderList = new ArrayList<>();
        try {
            String sql = "SELECT O.*, U.userName,U.email, S.statusName "
                    + "FROM Orders AS O "
                    + "JOIN Users AS U ON O.userID = U.userID "
                    + "JOIN Status AS S ON O.statusID = S.statusID "
                    + "WHERE O.statusID = ? "
                    + "ORDER BY O.orderID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY"; // Thay 10 bằng số lượng đơn hàng bạn muốn lấy trong mỗi trang

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, statusId); // ID của trạng thái
            ps.setInt(2, (index - 1) * 9); // index bắt đầu từ 1, nên cần trừ đi 1 để tính OFFSET

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order order = new Order();
                order.setOrderID(rs.getInt("orderID"));
                order.setOrder_date(rs.getString("order_date"));
                order.setPhone(rs.getString("phone"));
                order.setAddress(rs.getString("addressShip"));
                order.setTotalMoney(rs.getFloat("totalMoney"));

                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                order.setUser(user);

                Status status = new Status();
                status.setStatusID(rs.getInt("statusID"));
                status.setStatusName(rs.getString("statusName"));
                order.setStatus(status);

                orderList.add(order);
            }
        } catch (Exception e) {
            System.out.println("Error getting list of orders by status: " + e.getMessage());
        }
        return orderList;
    }

    public int getTotalOrderByStatus(int statusId) {
        int total = 0;
        try {
            String sql = "SELECT COUNT(*) AS total FROM Orders WHERE statusID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, statusId);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                total = rs.getInt("total");
            }
        } catch (Exception e) {
            System.out.println("Error getting total orders by status: " + e.getMessage());
        }
        return total;
    }

    public Order getOrderByOrderID(int orderID) {
        Order order = null;
        try {
            String sql = "SELECT O.*, U.userName, U.email, S.statusName "
                    + "FROM Orders AS O "
                    + "JOIN Users AS U ON O.userID = U.userID "
                    + "JOIN Status AS S ON O.statusID = S.statusID "
                    + "WHERE O.orderID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, orderID);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                order = new Order();
                order.setOrderID(rs.getInt("orderID"));
                order.setOrder_date(rs.getString("order_date"));
                order.setPhone(rs.getString("phone"));
                order.setAddress(rs.getString("addressShip"));
                order.setTotalMoney(rs.getFloat("totalMoney"));

                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                order.setUser(user);

                Status status = new Status();
                status.setStatusID(rs.getInt("statusID"));
                status.setStatusName(rs.getString("statusName"));
                order.setStatus(status);
            }
        } catch (Exception e) {
            System.out.println("Error getting order by ID: " + e.getMessage());
        }
        return order;
    }

    public boolean updateOrder(int orderID, int statusID) {
        try {
            String sql = "UPDATE Orders SET statusID = ? WHERE orderID = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, statusID);
            ps.setInt(2, orderID);

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("Error updating order: " + e.getMessage());
            return false;
        }
    }

    public ArrayList<Order> searchOrderByEmailPage(String email, int index) {
        ArrayList<Order> orderList = new ArrayList<>();
        try {
            String sql = "SELECT O.*, U.userName, U.email, S.statusName "
                    + "FROM Orders AS O "
                    + "JOIN Users AS U ON O.userID = U.userID "
                    + "JOIN Status AS S ON O.statusID = S.statusID "
                    + "WHERE U.email LIKE ? "
                    + "ORDER BY O.orderID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + email + "%"); // Tìm kiếm theo mẫu địa chỉ email
            ps.setInt(2, (index - 1) * 9); // index bắt đầu từ 1, nên cần trừ đi 1 để tính OFFSET

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order order = new Order();
                order.setOrderID(rs.getInt("orderID"));

                order.setOrder_date(rs.getString("order_date"));

                order.setPhone(rs.getString("phone"));
                order.setAddress(rs.getString("addressShip"));
                order.setTotalMoney(rs.getFloat("totalMoney"));

                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                order.setUser(user);

                Status status = new Status();
                status.setStatusID(rs.getInt("statusID"));
                status.setStatusName(rs.getString("statusName"));
                order.setStatus(status);

                orderList.add(order);
            }
        } catch (Exception e) {
            System.out.println("Error searching orders by email: " + e.getMessage());
        }
        return orderList;
    }

    public int getTotalOrderByEmail(String email) {
        int totalOrder = 0;
        try {
            String sql = "SELECT COUNT(*) AS total "
                    + "FROM Orders AS O "
                    + "JOIN Users AS U ON O.userID = U.userID "
                    + "WHERE U.email LIKE ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + email + "%"); // Tìm kiếm theo mẫu địa chỉ email

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalOrder = rs.getInt("total");
            }
        } catch (Exception e) {
            System.out.println("Error getting total orders by email: " + e.getMessage());
        }
        return totalOrder;
    }

}

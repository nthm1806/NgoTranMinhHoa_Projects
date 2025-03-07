/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Role;
import Model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class UserDAO {

    public static UserDAO INSTANCE = new UserDAO();
    private Connection con;
    private String status = "OK";

    private UserDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public User checkUserExist(String email) {
        try {
            String sql = "SELECT Users.userID, Users.userName, Users.email, Users.password, Users.roleID, Roles.roleName, Users.defaultPhone, Users.defaultAddress\n"
                    + "FROM Users\n"
                    + "INNER JOIN Roles ON Users.roleID = Roles.roleID\n"
                    + "WHERE Users.email = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setDefaultAddress(rs.getString("defaultAddress"));
                user.setDefaultPhone(rs.getString("defaultPhone"));
                Role role = new Role();
                role.setRoleID(rs.getInt("roleID"));
                role.setRoleName(rs.getString("roleName"));
                user.setRole(role);

                // Lưu ý: Ở đây bạn có thể thêm các trường thông tin khác của người dùng nếu cần
                return user;
            }
        } catch (Exception e) {
            System.out.println("Error checking user existence: " + e.getMessage());
        }

        return null;
    }

    public void createUser(String userName, String email, String password, int role) {
        try {
            String sql = "INSERT INTO [dbo].[Users] "
                    + "([userName], [email], [password], [roleID]) "
                    + "VALUES (?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, userName);
            ps.setString(2, email);
            ps.setString(3, password);
            ps.setInt(4, role);

            // Thực thi câu lệnh INSERT và kiểm tra số hàng bị ảnh hưởng
            int rowsAffected = ps.executeUpdate();

            // Kiểm tra xem câu lệnh INSERT đã thành công hay không
            if (rowsAffected > 0) {
                System.out.println("User created successfully.");
            } else {
                System.out.println("Failed to create user.");
            }

        } catch (Exception e) {
            System.out.println("createUser:" + e.getMessage());
        }
    }

    public User checkUser(String email, String password) {
        try {
            String sql = "SELECT Users.userID, Users.userName, Users.email, Users.password, Users.roleID, Roles.roleName, Users.defaultPhone, Users.defaultAddress\n"
                    + "FROM Users\n"
                    + "INNER JOIN Roles ON Users.roleID = Roles.roleID\n"
                    + "WHERE Users.email = ? AND Users.password = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                User user = new User();
                user.setEmail(email);
                user.setPassword(password);
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setDefaultPhone(rs.getString("defaultPhone"));
                user.setDefaultAddress(rs.getString("defaultAddress"));
                Role role = new Role();
                role.setRoleID(rs.getInt("roleID"));
                role.setRoleName(rs.getString("roleName"));
                user.setRole(role);
                return user;
            }
        } catch (Exception e) {
            System.out.println("getUserEmailPassword:" + e.getMessage());
        }
        return null;
    }

    public ArrayList<User> getUserByIndex(int index) {
        ArrayList<User> userList = new ArrayList<>();

        try {
            String sql = "SELECT U.*, R.roleName "
                    + "FROM Users AS U "
                    + "JOIN Roles AS R ON U.roleID = R.roleID "
                    + "ORDER BY U.userID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY"; // Thay 10 bằng số lượng người dùng bạn muốn lấy trong mỗi trang

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, (index - 1) * 9); // index bắt đầu từ 1, nên cần trừ đi 1 để tính OFFSET
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setDefaultAddress(rs.getString("defaultAddress"));
                user.setDefaultPhone(rs.getString("defaultPhone"));

                Role role = new Role();
                role.setRoleID(rs.getInt("roleID"));
                role.setRoleName(rs.getString("roleName"));
                user.setRole(role);

                userList.add(user);
            }
        } catch (Exception e) {
            System.out.println("getUsersByPage: " + e.getMessage());
        }
        return userList;
    }

    public int getTotalUser() {
        int totalUsers = 0;

        try {
            String sql = "SELECT COUNT(*) AS totalUsers "
                    + "FROM Users";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalUsers = rs.getInt("totalUsers");
            }
        } catch (Exception e) {
            System.out.println("getTotalUser: " + e.getMessage());
        }

        return totalUsers;
    }

    public boolean updateUser(int userID, String userName, int roleID) {
        try {
            String sql = "UPDATE Users SET userName = ?, roleID = ? WHERE userID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, userName);
            ps.setInt(2, roleID);
            ps.setInt(3, userID);

            int rowsAffected = ps.executeUpdate();

            ps.close();

            return rowsAffected > 0;
        } catch (Exception ex) {
            System.err.println("Error updating user: " + ex.getMessage());
            return false;
        }
    }

    public boolean addUser(String email, String userName, String password, int roleID, String defaultPhone, String defaultAddress) {
        try {
            String sql = "INSERT INTO Users (userName, email, password, roleID, defaultPhone, defaultAddress) VALUES (?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, userName);
            ps.setString(2, email);
            ps.setString(3, password);
            ps.setInt(4, roleID);
            ps.setString(5, defaultPhone);
            ps.setString(6, defaultAddress);

            int rowsAffected = ps.executeUpdate();

            ps.close();

            return rowsAffected > 0;
        } catch (Exception ex) {
            System.err.println("Error adding user: " + ex.getMessage());
            return false;
        }
    }

    public ArrayList<User> searchByUserEmailPage(String email, int index) {
        ArrayList<User> userList = new ArrayList<>();

        try {
            String sql = "SELECT U.*, R.roleName "
                    + "FROM Users AS U "
                    + "JOIN Roles AS R ON U.roleID = R.roleID "
                    + "WHERE U.email LIKE ? "
                    + "ORDER BY U.userID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + email + "%"); // Tìm kiếm theo mẫu địa chỉ email
            ps.setInt(2, (index - 1) * 9); // index bắt đầu từ 1, nên cần trừ đi 1 để tính OFFSET

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setDefaultAddress(rs.getString("defaultAddress"));
                user.setDefaultPhone(rs.getString("defaultPhone"));

                Role role = new Role();
                role.setRoleID(rs.getInt("roleID"));
                role.setRoleName(rs.getString("roleName"));
                user.setRole(role);

                userList.add(user);
            }
        } catch (Exception e) {
            System.out.println("Error searching users by email: " + e.getMessage());
        }

        return userList;
    }

    public int getTotalByUserEmail(String email) {
        int totalUsers = 0;
        try {
            String sql = "SELECT COUNT(*) AS total FROM Users WHERE email LIKE ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + email + "%");
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalUsers = rs.getInt("total");
            }
        } catch (Exception e) {
            System.out.println("Error getting total users by email: " + e.getMessage());
        }
        return totalUsers;
    }

    public boolean updateProfile(int userID, String userName, String phoneDefault, String addressDefault) {
        try {
            String sql = "UPDATE Users SET userName = ?, defaultPhone = ?, defaultAddress = ? WHERE userID = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, userName);
            ps.setString(2, phoneDefault);
            ps.setString(3, addressDefault);
            ps.setInt(4, userID);

            int rowsAffected = ps.executeUpdate();

            // Kiểm tra xem có hàng nào được cập nhật không
            if (rowsAffected > 0) {
                System.out.println("User profile updated successfully.");
                return true;
            } else {
                System.out.println("Failed to update user profile.");
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error updating user profile: " + e.getMessage());
            return false;
        }
    }

}

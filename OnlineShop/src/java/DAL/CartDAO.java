/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Brand;
import Model.Cart;
import Model.Category;
import Model.Product;
import Model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class CartDAO {

    public static CartDAO INSTANCE = new CartDAO();
    private Connection con;
    private String status = "OK";

    private CartDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Cart> getCartListByUser(int userID) {
        ArrayList<Cart> list = new ArrayList<Cart>();
        try {
            String sql = "SELECT c.cartID, c.userID, c.productID, c.amount, c.price, " +
                     "u.userName, " +
                     "p.*, " +
                     "b.brandID, b.brandName, " +
                     "cat.categoryID, cat.categoryName " +
                     "FROM Cart c " +
                     "INNER JOIN Users u ON c.userID = u.userID " +
                     "INNER JOIN Products p ON c.productID = p.productID " +
                     "INNER JOIN Brands b ON p.brandID = b.brandID " +
                     "INNER JOIN Category cat ON p.categoryID = cat.categoryID " +
                     "WHERE c.userID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Cart cart = new Cart();
                cart.setCartID(rs.getInt("cartID"));
                User u = new User();
                u.setUserID(userID);
                u.setUserName(rs.getString("userID"));
                cart.setUser(u);
                Product p = new Product();
                p.setProductID(rs.getInt("productID"));
                p.setProductName(rs.getString("productName"));
                p.setProductPrice(rs.getFloat("productPrice"));
                p.setQuantity(rs.getInt("quantity"));
                Brand brand = new Brand();
                brand.setBrandID(rs.getInt("brandID"));
                brand.setBrandName(rs.getString("brandName"));
                p.setBrand(brand);
                Category category = new Category();
                category.setCategoryID(rs.getInt("categoryID"));
                category.setCategoryName(rs.getString("categoryName"));
                p.setCategory(category);
                p.setImage(rs.getString("images"));
                cart.setProduct(p);
                cart.setAmount(rs.getInt("amount"));
                cart.setPrice(rs.getFloat("price"));
                list.add(cart);

            }
        } catch (Exception e) {
            System.out.println("getCartByUserID:" + e.getMessage());
        }
        return list;
    }

    public void updateAmount(int cartID, int amount, float price) {
        try {
            String sql = "UPDATE Cart "
                    + "SET amount = ?, price = ? "
                    + "WHERE cartID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, amount);
            ps.setFloat(2, price);
            ps.setInt(3, cartID);

            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Update successful.");
            } else {
                System.out.println("No rows updated.");
            }

            ps.close();
        } catch (Exception e) {
            System.out.println("updateAmount: " + e.getMessage());
        }
    }

    public void addCart(int userID, int productID, int amount, float price) {
        try {
            String sql = "INSERT INTO Cart (userID, productID, amount, price) VALUES (?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);
            ps.setInt(2, productID);
            ps.setInt(3, amount);
            ps.setFloat(4, price);

            ps.executeUpdate();

        } catch (Exception e) {
            System.out.println("addCart: " + e.getMessage());
        }

    }

    public Cart getCartByID(int cartID) {
try {
            String sql = "SELECT c.cartID, c.userID, c.productID, c.amount, c.price, " +
                     "u.userName, " +
                     "p.*, " +
                     "b.brandID, b.brandName, " +
                     "cat.categoryID, cat.categoryName " +
                     "FROM Cart c " +
                     "INNER JOIN Users u ON c.userID = u.userID " +
                     "INNER JOIN Products p ON c.productID = p.productID " +
                     "INNER JOIN Brands b ON p.brandID = b.brandID " +
                     "INNER JOIN Category cat ON p.categoryID = cat.categoryID " +
                     "WHERE c.cartID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, cartID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Cart cart = new Cart();
                cart.setCartID(rs.getInt("cartID"));
                User u = new User();
                u.setUserID(rs.getInt("userID"));
                u.setUserName(rs.getString("userName"));
                cart.setUser(u);
                Product p = new Product();
                p.setProductID(rs.getInt("productID"));
                p.setProductName(rs.getString("productName"));
                p.setProductPrice(rs.getFloat("productPrice"));
                p.setQuantity(rs.getInt("quantity"));
                Brand brand = new Brand();
                brand.setBrandID(rs.getInt("brandID"));
                brand.setBrandName(rs.getString("brandName"));
                p.setBrand(brand);
                Category category = new Category();
                category.setCategoryID(rs.getInt("categoryID"));
                category.setCategoryName(rs.getString("categoryName"));
                p.setCategory(category);
                p.setImage(rs.getString("images"));
                cart.setProduct(p);
                cart.setAmount(rs.getInt("amount"));
                cart.setPrice(rs.getFloat("price"));
                return cart;

            }
        } catch (Exception e) {
            System.out.println("getCartByCartID:" + e.getMessage());
        }
        return null;    }

    public void deleteCart(int cartID) {
    try {
        // Tạo câu lệnh SQL DELETE
        String sql = "DELETE FROM Cart WHERE cartID = ?";

        // Chuẩn bị câu lệnh SQL
        PreparedStatement ps = con.prepareStatement(sql);

        // Đặt giá trị của tham số cartID
        ps.setInt(1, cartID);

        // Thực thi câu lệnh DELETE
        ps.executeUpdate();

        // Đóng PreparedStatement
        ps.close();

        System.out.println("Cart with ID " + cartID + " has been deleted successfully.");
    } catch (Exception e) {
        System.out.println("Error deleting cart: " + e.getMessage());
    }
}


}

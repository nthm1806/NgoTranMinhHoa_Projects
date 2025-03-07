package DAL;

import Model.Product;
import Model.Review;
import Model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class ReviewDAO {

    public static ReviewDAO INSTANCE = new ReviewDAO();
    private Connection con;
    private String status = "OK";

    private ReviewDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Review> getReviewByProductID(int productID) {
        ArrayList<Review> reviewList = new ArrayList<>();
        try {
            String sql = "SELECT R.*, U.userID, U.userName, P.productName "
                    + "FROM Reviews AS R "
                    + "JOIN Users AS U ON R.userID = U.userID "
                    + "JOIN Products AS P ON R.productID = P.productID "
                    + "WHERE R.productID = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, productID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Review review = new Review();
                review.setReviewID(rs.getInt("reviewID"));

                User user = new User();
                user.setUserID(rs.getInt("userID"));
                user.setUserName(rs.getString("userName"));
                review.setUser(user);

                review.setDate_created(rs.getString("dateCreated"));

                Product product = new Product();
                product.setProductID(rs.getInt("productID"));
                product.setProductName(rs.getString("productName"));
                review.setProduct(product);

                review.setReviewContent(rs.getString("reviewContent"));

                reviewList.add(review);
            }
        } catch (SQLException e) {
            System.out.println("Error getting reviews by product ID: " + e.getMessage());
        }
        return reviewList;
    }

    public boolean addReviewToProductByUserID(int productID, int userID, String orderDate, String reviewContent) {
        try {
            String sql = "INSERT INTO Reviews (userID, dateCreated, productID, reviewContent) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, userID);
            ps.setString(2, orderDate);
            ps.setInt(3, productID);
            ps.setString(4, reviewContent);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.out.println("Error adding review to product: " + e.getMessage());
            return false;
        }
    }
}

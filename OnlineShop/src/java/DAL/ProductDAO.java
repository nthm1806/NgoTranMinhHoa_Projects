/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Brand;
import Model.Category;
import Model.Product;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class ProductDAO {

    public static ProductDAO INSTANCE = new ProductDAO();
    private Connection con;
    private String status = "OK";

    private ProductDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Product> getListByIndexPage(int index) {
        ArrayList<Product> list = new ArrayList<Product>();

        try {
            String sql = "SELECT P.*, C.categoryName, B.brandName "
                    + "FROM Products AS P "
                    + "JOIN Category AS C ON P.categoryID = C.categoryID "
                    + "JOIN Brands AS B ON P.brandID = B.brandID "
                    + "ORDER BY P.productID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, (index - 1) * 9);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {

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
                p.setProductDetail("productDetail");
                list.add(p);

            }
        } catch (Exception e) {
            System.out.println("pagingList:" + e.getMessage());
        }
        return list;
    }

    public int getTotalProduct() {
        try {
            String sql = "Select count(*) from Products";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                return rs.getInt(1);

            }
        } catch (Exception e) {
            System.out.println("getTotalProduct:" + e.getMessage());
        }
        return 0;
    }

    public Product getProductByID(int productID) {
        Product p = new Product();
        try {
            String sql = "SELECT p.*, "
                    + "b.brandID, b.brandName, "
                    + "c.categoryID, c.categoryName "
                    + "FROM Products p "
                    + "INNER JOIN Brands b ON p.brandID = b.brandID "
                    + "INNER JOIN Category c ON p.categoryID = c.categoryID "
                    + "WHERE p.productID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, productID);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
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
                p.setProductDetail(rs.getString("productDetail"));
                return p;

            }
        } catch (Exception e) {
            System.out.println("getProductByID:" + e.getMessage());
        }
        return null;
    }

    public ArrayList<Product> getListByCategory(int categoryId, int index) {
        ArrayList<Product> list = new ArrayList<>();

        try {
            String sql = "SELECT P.*, C.categoryName, B.brandName "
                    + "FROM Products AS P "
                    + "JOIN Category AS C ON P.categoryID = C.categoryID "
                    + "JOIN Brands AS B ON P.brandID = B.brandID "
                    + "WHERE P.categoryID = ? " // Thêm điều kiện cho categoryID
                    + "ORDER BY P.productID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, categoryId);
            ps.setInt(2, (index - 1) * 9);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
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
                p.setProductDetail("productDetail");
                list.add(p);
            }
        } catch (Exception e) {
            System.out.println("getListByCategory: " + e.getMessage());
        }
        return list;
    }

    public ArrayList<Product> getListByBrand(int brandId, int index) {
        ArrayList<Product> list = new ArrayList<>();

        try {
            String sql = "SELECT P.*, C.categoryName, B.brandName "
                    + "FROM Products AS P "
                    + "JOIN Category AS C ON P.categoryID = C.categoryID "
                    + "JOIN Brands AS B ON P.brandID = B.brandID "
                    + "WHERE P.brandID = ? " // Thêm điều kiện cho brandId
                    + "ORDER BY P.productID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, brandId);
            ps.setInt(2, (index - 1) * 9);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
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
                p.setProductDetail("productDetail");
                list.add(p);
            }
        } catch (Exception e) {
            System.out.println("getListByBrand: " + e.getMessage());
        }
        return list;
    }

    public ArrayList<Product> getListByCategoryAndBrand(int categoryId, int brandId, int index) {
        ArrayList<Product> list = new ArrayList<>();

        try {
            String sql = "SELECT P.*, C.categoryName, B.brandName "
                    + "FROM Products AS P "
                    + "JOIN Category AS C ON P.categoryID = C.categoryID "
                    + "JOIN Brands AS B ON P.brandID = B.brandID "
                    + "WHERE P.categoryID = ? AND P.brandID = ? " // Thêm điều kiện cho categoryId và brandId
                    + "ORDER BY P.productID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, categoryId);
            ps.setInt(2, brandId);
            ps.setInt(3, (index - 1) * 9);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
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
                p.setProductDetail("productDetail");
                list.add(p);
            }
        } catch (Exception e) {
            System.out.println("getListByCategoryAndBrand: " + e.getMessage());
        }
        return list;
    }

    public ArrayList<Product> searchByProductName(String productName, int index) {
        ArrayList<Product> list = new ArrayList<>();

        try {
            String sql = "SELECT P.*, C.categoryName, B.brandName "
                    + "FROM Products AS P "
                    + "JOIN Category AS C ON P.categoryID = C.categoryID "
                    + "JOIN Brands AS B ON P.brandID = B.brandID "
                    + "WHERE P.productName LIKE ? " // Sử dụng LIKE để tìm kiếm các sản phẩm có tên chứa productName
                    + "ORDER BY P.productID "
                    + "OFFSET ? ROWS FETCH NEXT 9 ROWS ONLY";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + productName + "%");
            ps.setInt(2, (index - 1) * 9);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
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
                p.setProductDetail("productDetail");
                list.add(p);
            }
        } catch (Exception e) {
            System.out.println("searchByProductName: " + e.getMessage());
        }
        return list;
    }

    public boolean addProduct(String productName, int categoryId, int brandId, float productPrice, String imagePath, String productDetail, int quantity) {
        try {
            String sql = "INSERT INTO Products (productName, productPrice, quantity, brandID, categoryID, images, productDetail) VALUES (?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, productName);
            ps.setFloat(2, productPrice);
            ps.setInt(3, quantity);
            ps.setInt(4, brandId);
            ps.setInt(5, categoryId);
            ps.setString(6, imagePath);
            ps.setString(7, productDetail);

            int rowsAffected = ps.executeUpdate();

            return rowsAffected > 0; // Returns true if insertion is successful
        } catch (Exception e) {
            System.out.println("addProduct: " + e.getMessage());
            return false;
        }
    }

    public int getTotalProductByCategory(int categoryId) {
        int totalProducts = 0;

        try {
            String sql = "SELECT COUNT(*) AS totalProducts "
                    + "FROM Products "
                    + "WHERE categoryID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, categoryId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalProducts = rs.getInt("totalProducts");
            }
        } catch (Exception e) {
            System.out.println("getTotalProductByCategory: " + e.getMessage());
        }

        return totalProducts;
    }

    public int getTotalProductByBrand(int brandId) {
        int totalProducts = 0;

        try {
            String sql = "SELECT COUNT(*) AS totalProducts "
                    + "FROM Products "
                    + "WHERE brandID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, brandId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalProducts = rs.getInt("totalProducts");
            }
        } catch (Exception e) {
            System.out.println("getTotalProductByBrand: " + e.getMessage());
        }

        return totalProducts;
    }

    public int getTotalProductByCategoryAndBrand(int categoryId, int brandId) {
        int totalProducts = 0;

        try {
            String sql = "SELECT COUNT(*) AS totalProducts "
                    + "FROM Products "
                    + "WHERE categoryID = ? AND brandID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, categoryId);
            ps.setInt(2, brandId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalProducts = rs.getInt("totalProducts");
            }
        } catch (Exception e) {
            System.out.println("getTotalProductByCategoryAndBrand: " + e.getMessage());
        }

        return totalProducts;
    }

    public int getTotalProductByProductName(String productName) {
        int totalProducts = 0;
        try {
            String sql = "SELECT COUNT(*) AS total FROM Products WHERE productName LIKE ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, "%" + productName + "%");
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                totalProducts = rs.getInt("total");
            }
        } catch (Exception e) {
            System.out.println("Error getting total products by product name: " + e.getMessage());
        }
        return totalProducts;
    }

    public boolean updateProductByIDNotImage(int productID, String productName, int categoryId, int brandId, float productPrice, int quantity) {
        try {
            String sql = "UPDATE Products SET productName = ?, categoryId = ?, brandId = ?, productPrice = ?, quantity = ? WHERE productID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, productName);
            ps.setInt(2, categoryId);
            ps.setInt(3, brandId);
            ps.setFloat(4, productPrice);
            ps.setInt(5, quantity);
            ps.setInt(6, productID);

            int rowsAffected = ps.executeUpdate();

            ps.close();

            return rowsAffected > 0;
        } catch (Exception ex) {
            System.err.println("Error updating product: " + ex.getMessage());
            return false;
        }
    }

    public boolean updateProductByIDWithImage(int productID, String productName, int categoryId, int brandId, float productPrice, String imagePath, int quantity) {
        try {
            String sql = "UPDATE Products SET productName = ?, categoryId = ?, brandId = ?, productPrice = ?, images = ?, quantity = ? WHERE productID = ?";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, productName);
            ps.setInt(2, categoryId);
            ps.setInt(3, brandId);
            ps.setFloat(4, productPrice);
            ps.setString(5, imagePath);
            ps.setInt(6, quantity);
            ps.setInt(7, productID);

            int rowsAffected = ps.executeUpdate();

            ps.close();

            return rowsAffected > 0;
        } catch (Exception ex) {
            System.err.println("Error updating product with image: " + ex.getMessage());
            return false;
        }
    }

    public boolean deleteProductByID(int productID) {
        try {
            String sql = "DELETE FROM Products WHERE productID = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, productID);
            int rowsAffected = ps.executeUpdate();
            ps.close();
            return rowsAffected > 0;
        } catch (Exception ex) {
            System.err.println("Error deleting product: " + ex.getMessage());
            return false;
        }
    }
    
    public static void main(String[] args) {
        ProductDAO pb = new ProductDAO();
        pb.updateProductByIDNotImage(1, "vubac", 2, 2, 60, 50);
    }

}


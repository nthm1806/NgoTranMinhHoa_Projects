/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Category;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class CategoryDAO {
    public static CategoryDAO INSTANCE = new CategoryDAO();
    private Connection con;
    private String status = "OK";

    private CategoryDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;
            
        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Category> getCategoryList() {
        ArrayList<Category> list = new ArrayList<>();
        try {
            String sql = "Select * from Category";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Category category = new Category();
                category.setCategoryID(rs.getInt("categoryID"));
                category.setCategoryName(rs.getString("categoryName"));
                list.add(category);
            }
        } catch (Exception e) {
            System.out.println("getCategoryList:" + e.getMessage());
        }
        return list;
        
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Brand;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
public class BrandDAO {
    public static BrandDAO INSTANCE = new BrandDAO();
    private Connection con;
    private String status = "OK";

    private BrandDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;
            
        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Brand> getBrandList() {
        ArrayList<Brand> list = new ArrayList<>();
        try {
            String sql = "Select * from Brands";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Brand brand = new Brand();
                brand.setBrandID(rs.getInt("brandID"));
                brand.setBrandName(rs.getString("brandName"));
                list.add(brand);
            }
        } catch (Exception e) {
            System.out.println("getBrandList:" + e.getMessage());
        }
        return list;
    }
}

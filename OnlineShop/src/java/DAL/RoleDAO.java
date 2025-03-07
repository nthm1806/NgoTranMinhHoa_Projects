/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Role;
import java.sql.Connection;
import java.util.ArrayList;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
/**
 *
 * @author Admin
 */
public class RoleDAO {

    public static RoleDAO INSTANCE = new RoleDAO();
    private Connection con;
    private String status = "OK";

    private RoleDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Role> getAllRole() {
        ArrayList<Role> roleList = new ArrayList<>();

        try {
            String sql = "SELECT * FROM Roles";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Role role = new Role();
                role.setRoleID(rs.getInt("roleID"));
                role.setRoleName(rs.getString("roleName"));
                roleList.add(role);
            }
        } catch (Exception e) {
            System.out.println("getAllRole: " + e.getMessage());
        }

        return roleList;
    }

}

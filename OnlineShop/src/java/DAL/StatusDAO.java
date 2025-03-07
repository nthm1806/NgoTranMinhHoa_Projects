/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

import Model.Status;
import java.sql.Connection;
import java.util.ArrayList;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author Admin
 */
public class StatusDAO {

    public static StatusDAO INSTANCE = new StatusDAO();
    private Connection con;
    private String status = "OK";

    private StatusDAO() {
        if (INSTANCE == null) {
            con = new DBContext().connect;

        } else {
            INSTANCE = this;
        }
    }

    public ArrayList<Status> getStatusList() {
        ArrayList<Status> statusList = new ArrayList<>();
        try {
            String sql = "SELECT * FROM Status";
            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Status status = new Status();
                status.setStatusID(rs.getInt("statusID"));
                status.setStatusName(rs.getString("statusName"));
                statusList.add(status);
            }
        } catch (Exception e) {
            System.out.println("Error getting status list: " + e.getMessage());
        }
        return statusList;
    }

}

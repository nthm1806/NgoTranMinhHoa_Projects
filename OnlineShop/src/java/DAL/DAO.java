///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package DAL;
//
///**
// *
// * @author Admin
// */
//import Model.Human;
//import Model.HumanType;
//import java.sql.*;
//import java.util.ArrayList;
//import java.util.List;
//
//public class DAO {
//
//    public static DAO INSTANCE = new DAO();
//    private Connection con;
//    private String status = "OK";
//
//    private DAO() {
//        if (INSTANCE == null) {
//            con = new DBContext().connect;
//            
//        } else {
//            INSTANCE = this;
//        }
//    }
//
////    public static void main(String[] args) {
////        DAO.INSTANCE.loadDB();
////        System.out.println("-----");
////    }
//    public ArrayList<Human> getHumans() {
//        ArrayList<Human> humans = new ArrayList<>();
//        try {
//            String sql = "SELECT h.humanid, h.humanname, h.humandob, h.humangender, ht.typeid, ht.typename "
//                    + "FROM Human h INNER JOIN HumanType ht ON h.typeid = ht.typeid";
//
//            PreparedStatement ps = con.prepareStatement(sql);
//            ResultSet rs = ps.executeQuery();
//            while (rs.next()) {
//                Human h = new Human();
//                h.setID(rs.getInt("humanid"));
//                h.setName(rs.getString("humanname"));
//                h.setDob(rs.getDate("humandob"));
//                h.setGender(rs.getBoolean("humangender"));
//
//                HumanType ht = new HumanType();
//                ht.setTypeID(rs.getInt("typeid"));
//                ht.setName(rs.getString("typename"));
//                h.setType(ht);
//                humans.add(h);
//            }
//        } catch (Exception e) {
//            System.out.println("getHumans:" + e.getMessage());
//        }
//        return humans;
//    }
//
//    public Human getHumanById(int humanID) {
//        Human h = new Human();
//        try {
//            String sql = "SELECT h.humanid, h.humanname, h.humandob, h.humangender, ht.typeid, ht.typename "
//                    + "FROM Human h INNER JOIN HumanType ht ON h.typeid = ht.typeid "
//                    + "WHERE h.humanid = ?";
//
//            PreparedStatement ps = con.prepareStatement(sql);
//            ps.setInt(1, humanID);
//            ResultSet rs = ps.executeQuery();
//            while (rs.next()) {
//
//                h.setID(rs.getInt("humanid"));
//                h.setName(rs.getString("humanname"));
//                h.setDob(rs.getDate("humandob"));
//                h.setGender(rs.getBoolean("humangender"));
//
//                HumanType ht = new HumanType();
//                ht.setTypeID(rs.getInt("typeid"));
//                ht.setName(rs.getString("typename"));
//                h.setType(ht);
//
//            }
//        } catch (Exception e) {
//            System.out.println("getHumanByID: " + e.getMessage());
//            return null;
//        }
//        return h;
//    }
//
//    public boolean deleteHuman(int humanID) {
//        try {
//            String sql = "Delete Human "
//                    + "where humanID=? ";
//
//            PreparedStatement ps = con.prepareStatement(sql);
//            ps.setInt(1, humanID);
//            ps.executeUpdate();
//            return true;
//        } catch (Exception e) {
//            System.out.println("deleteHuman: " + e.getMessage());
//            return false;
//        }
//    }
//
//    public ArrayList<HumanType> getTypes() {
//        ArrayList<HumanType> types = new ArrayList<>();
//        try {
//            String sql = """
//                         SELECT [typeid]
//                         , [typename]
//                          FROM [HumanType]""";
//            PreparedStatement ps = con.prepareStatement(sql);
//            ResultSet rs = ps.executeQuery();
//            while (rs.next()) {
//                HumanType ht = new HumanType();
//                ht.setTypeID(rs.getInt("typeid"));
//                ht.setName(rs.getString("typename"));
//                types.add(ht);
//            }
//        } catch (Exception e) {
//            System.out.println("getTypes: " + e.getMessage());
//        }
//        return types;
//    }
//
//    public boolean insertHuman(String name, Date dobString, int gender, int typeID) {
//        try {
//            String sql = "insert into Human "
//                    + "values(?,?,?,?)";
//
//            PreparedStatement ps = con.prepareStatement(sql);
//            ps.setString(1, name);
//            ps.setDate(2, dobString);
//            ps.setInt(3, gender);
//            ps.setInt(4, typeID);
//            ps.executeUpdate();
//            return true;
//        } catch (Exception e) {
//            System.out.println("insertHuman: " + e.getMessage());
//            return false;
//        }
//    }
//
//    public boolean updateHumanById(int humanID, String name, Date dobString, int gender, int typeID) {
//        try {
//            String sql = "update Human "
//                    + "set humanname=?,humandob=?,humangender=?,typeid=? "
//                    + "where humanID=?";
//            PreparedStatement ps = con.prepareStatement(sql);
//            ps.setString(1, name);
//            ps.setDate(2, dobString);
//            ps.setInt(3, gender);
//            ps.setInt(4, typeID);
//            ps.setInt(5, humanID);
//            ps.executeUpdate();
//            return true;
//        } catch (Exception e) {
//            System.out.println("updateHuman: " + e.getMessage());
//            return false;
//        }
//    }
//
//    public ArrayList<Human> getHumanByName(String searchName) {
//        ArrayList<Human> humans = new ArrayList<>();
//        try {
//            String sql = "SELECT h.humanid, h.humanname, h.humandob, h.humangender, ht.typeid, ht.typename "
//                    + "FROM Human h INNER JOIN HumanType ht ON h.typeid = ht.typeid "
//                    + "WHERE h.humanname LIKE ?";
//            PreparedStatement ps = con.prepareStatement(sql);
//            ps.setString(1, "%" + searchName + "%");
//            ResultSet rs = ps.executeQuery();
//            while (rs.next()) {
//                Human h = new Human();
//                h.setID(rs.getInt("humanid"));
//                h.setName(rs.getString("humanname"));
//                h.setDob(rs.getDate("humandob"));
//                h.setGender(rs.getBoolean("humangender"));
//
//                HumanType ht = new HumanType();
//                ht.setTypeID(rs.getInt("typeid"));
//                ht.setName(rs.getString("typename"));
//                h.setType(ht);
//                humans.add(h);
//            }
//        } catch (Exception e) {
//            System.out.println("getHumansByName:" + e.getMessage());
//        }
//        return humans;
//    }
//
//}

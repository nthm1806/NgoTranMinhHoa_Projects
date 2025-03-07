/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAL;

/**
 *
 * @author Admin
 */
import java.sql.DriverManager;
import java.sql.Connection;
public class DBContext {
    protected Connection connect;
    public DBContext(){
        try {
            String url = "jdbc:sqlserver://"+serverName+":"+portNumber +
                    ";databaseName="+dbName;
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            connect = DriverManager.getConnection(url,userID,password);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private final String serverName = "localhost";
    private final String dbName = "OnlineShop_BL5";
    private final String portNumber = "1433";
    private final String userID = "sa";
    private final String password = "123";
}

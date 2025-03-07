/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Controller;

import DAL.OrderDAO;
import DAL.StatusDAO;
import Model.Order;
import Model.Status;
import jakarta.servlet.RequestDispatcher;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
@WebServlet(name = "filterOrder", urlPatterns = {"/filterOrder"})
public class filterOrder extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet filterOrder</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet filterOrder at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        RequestDispatcher requestDispatcher;
        HttpSession session = request.getSession();
        int indexDefault = 1;
        session.setAttribute("indexDefault", indexDefault);
        String indexParameter = request.getParameter("index");
        int index;
        if (indexParameter == null || indexParameter.isEmpty()) {
            // Xử lý khi không có tham số "index" hoặc giá trị là rỗng
            index = indexDefault;
        } else {
            index = Integer.parseInt(indexParameter);
            // Xử lý khi có giá trị hợp lệ cho "index"
        }
        int statusId = Integer.parseInt(request.getParameter("statusID"));

        System.out.println("statusID is: " + statusId);

        ArrayList<Order> orderList = new ArrayList<>();
        int totalOrder= 0;
        int endPage;
        ArrayList<Status> statusList = StatusDAO.INSTANCE.getStatusList();

        request.setAttribute("statusList", statusList);
        System.out.println("Ready to test");
        if (statusId == 0) { //Chọn All hết
            System.out.println("Enter all");
            orderList = OrderDAO.INSTANCE.getListOrderByIndexPage(index);

            totalOrder = OrderDAO.INSTANCE.getTotalOrder();
          
        }  else {
            orderList = OrderDAO.INSTANCE.getListOrderByStatusPage(statusId,index);

            totalOrder = OrderDAO.INSTANCE.getTotalOrderByStatus(statusId);
        }
        System.out.println("----------------------------------------------");

        endPage = totalOrder / 9;
        if (totalOrder % 9 != 0) {
            endPage++; //if the posts in the last page has less than 9, +1 page to include these post
        }

        request.setAttribute("index", index);
        request.setAttribute("statusList", statusList);
        request.setAttribute("endPage", endPage);
        request.setAttribute("statusID", statusId);
       
        ;
        requestDispatcher = request.getRequestDispatcher("orderListFilterAdmin.jsp");
        requestDispatcher.forward(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        RequestDispatcher requestDispatcher;
        HttpSession session = request.getSession();
        int indexDefault = 1;
        session.setAttribute("indexDefault", indexDefault);
        String indexParameter = request.getParameter("index");
        int index;
        if (indexParameter == null || indexParameter.isEmpty()) {
            // Xử lý khi không có tham số "index" hoặc giá trị là rỗng
            index = indexDefault;
        } else {
            index = Integer.parseInt(indexParameter);
            // Xử lý khi có giá trị hợp lệ cho "index"
        }
        int statusId = Integer.parseInt(request.getParameter("statusID"));

        System.out.println("statusID is: " + statusId);

        ArrayList<Order> orderList = new ArrayList<>();
        int totalOrder= 0;
        int endPage;
        ArrayList<Status> statusList = StatusDAO.INSTANCE.getStatusList();
        request.setAttribute("statusList", statusList);
        System.out.println("Ready to test");
        if (statusId == 0) { //Chọn All hết
            System.out.println("Enter all");
            orderList = OrderDAO.INSTANCE.getListOrderByIndexPage(index);

            totalOrder = OrderDAO.INSTANCE.getTotalOrder();
          
        }  else {
            orderList = OrderDAO.INSTANCE.getListOrderByStatusPage(statusId,index);

            totalOrder = OrderDAO.INSTANCE.getTotalOrderByStatus(statusId);
        }
        System.out.println("----------------------------------------------");

        endPage = totalOrder / 9;
        if (totalOrder % 9 != 0) {
            endPage++; //if the posts in the last page has less than 9, +1 page to include these post
        }

        request.setAttribute("index", index);
        request.setAttribute("orderList", orderList);
        request.setAttribute("endPage", endPage);
        request.setAttribute("statusID", statusId);
       
        ;
        requestDispatcher = request.getRequestDispatcher("orderListFilterAdmin.jsp");
        requestDispatcher.forward(request, response);

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}

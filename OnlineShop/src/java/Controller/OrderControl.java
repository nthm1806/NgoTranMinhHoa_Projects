/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Controller;

import DAL.CartDAO;
import DAL.OrderDAO;
import Model.Cart;
import Model.Order;
import Model.User;
import jakarta.servlet.RequestDispatcher;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
@WebServlet(name = "OrderControl", urlPatterns = {"/order"})
public class OrderControl extends HttpServlet {

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
            out.println("<title>Servlet OrderControl</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet OrderControl at " + request.getContextPath() + "</h1>");
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
        User user = (User) session.getAttribute("user");
        ArrayList<Order> orderList  = OrderDAO.INSTANCE.getOrderByUserID(user.getUserID());
        request.setAttribute("orderList", orderList);
        requestDispatcher = request.getRequestDispatcher("order.jsp");
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
        float totalPrice = 0;
        int statusID = 1;
        String name = request.getParameter("name");
        String addressShip = request.getParameter("address");
        String phone = request.getParameter("phone");
        User user = (User) session.getAttribute("user");
        LocalDate currentDate = LocalDate.now();

        // Định dạng thời gian thành chuỗi "dd/MM/yyyy"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String orderDate = currentDate.format(formatter);
        System.out.println("Ngay hien tai: " + orderDate);

        ArrayList<Cart> cartList = CartDAO.INSTANCE.getCartListByUser(user.getUserID());
        for (Cart cart1 : cartList) {
            totalPrice += cart1.getPrice();

        }
        OrderDAO.INSTANCE.addOrder(user.getUserID(), name, orderDate, addressShip, phone, statusID, totalPrice);
        Order order = OrderDAO.INSTANCE.getOrderNeedToCreateDetail();

        for (Cart cart1 : cartList) {
            if (OrderDAO.INSTANCE.addOrderDetail(order.getOrderID(), cart1.getProduct().getProductID(), cart1.getPrice(), cart1.getAmount())) {
                CartDAO.INSTANCE.deleteCart(cart1.getCartID());
            } else {
                System.out.println("Add failed");
                return;
            }

        }
        OrderDAO.INSTANCE.updateNeedToCreateDetail(user.getUserID());
        response.sendRedirect(request.getServletContext().getContextPath() + "/home");

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

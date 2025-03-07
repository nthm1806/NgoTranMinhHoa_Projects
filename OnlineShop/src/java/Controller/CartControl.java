/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Controller;

import DAL.CartDAO;
import DAL.ProductDAO;
import Model.Cart;
import Model.Product;
import Model.User;
import jakarta.servlet.RequestDispatcher;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
@WebServlet(name = "CartControl", urlPatterns = {"/addCart"})
public class CartControl extends HttpServlet {

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
            out.println("<title>Servlet CartControl</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet CartControl at " + request.getContextPath() + "</h1>");
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

        int amount = 1;
        float totalPrice = 0;
        boolean exist = false;
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        String productIDString = request.getParameter("productID");
        ArrayList<Cart> cartList;
        if (productIDString == null || productIDString.isEmpty()) {
            // Xử lý trường hợp productIDString là null hoặc rỗng ở đây
        } else {
            int productID = Integer.parseInt(productIDString);
            // Tiếp tục xử lý khi productID không là null
            Product product = ProductDAO.INSTANCE.getProductByID(productID);
            cartList = CartDAO.INSTANCE.getCartListByUser(user.getUserID());
            for (Cart cart : cartList) {
                if (cart.getProduct().getProductID() == productID) {
                    amount = cart.getAmount() + 1;
                    CartDAO.INSTANCE.updateAmount(cart.getCartID(), amount, amount * product.getProductPrice());
                    exist = true;
                    break;
                }

            }
            System.out.println("Done loop 1");
            if (!exist) {
                CartDAO.INSTANCE.addCart(user.getUserID(), productID, amount, amount * product.getProductPrice());
                System.out.println("Done adding");

            }
        }

        cartList = CartDAO.INSTANCE.getCartListByUser(user.getUserID());

        for (Cart cart1 : cartList) {
            totalPrice += cart1.getPrice();

        }
        request.setAttribute("totalPrice", totalPrice);
        request.setAttribute("cartList", cartList);
        requestDispatcher = request.getRequestDispatcher("cart.jsp");
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
        processRequest(request, response);
        Cookie[] cookies = request.getCookies();
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

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Controller;

import DAL.BrandDAO;
import DAL.CategoryDAO;
import DAL.ProductDAO;
import Model.Brand;
import Model.Category;
import Model.Product;
import jakarta.servlet.RequestDispatcher;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;

/**
 *
 * @author Admin
 */
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // Kích thước tệp tạm thời trước khi lưu trữ trên đĩa
        maxFileSize = 1024 * 1024 * 5, // Kích thước tối đa cho mỗi tệp (5MB)
        maxRequestSize = 1024 * 1024 * 10 // Kích thước tối đa cho toàn bộ yêu cầu (10MB)
)
@WebServlet(name = "updateProduct", urlPatterns = {"/updateProduct"})
public class updateProduct extends HttpServlet {

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
            out.println("<title>Servlet updateProduct</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet updateProduct at " + request.getContextPath() + "</h1>");
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
        int productID = Integer.parseInt(request.getParameter("productID"));
        // Tiếp tục xử lý khi productID không là null
        Product product = ProductDAO.INSTANCE.getProductByID(productID);
        request.setAttribute("product", product);
        System.out.println(product.getProductDetail());
        ArrayList<Category> categoryList = CategoryDAO.INSTANCE.getCategoryList();
        ArrayList<Brand> brandList = BrandDAO.INSTANCE.getBrandList();
        request.setAttribute("categoryList", categoryList);
        request.setAttribute("oldImage", product.getImage());
        System.out.println("Old image is " + product.getImage());
        request.setAttribute("brandList", brandList);

        requestDispatcher = request.getRequestDispatcher("updateProduct.jsp");
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
        Part part = request.getPart("image");
        System.out.println("part size " + part.getSize());

        String productName = request.getParameter("productName");
        int categoryId = Integer.parseInt(request.getParameter("categoryID"));
        int brandId = Integer.parseInt(request.getParameter("brandID"));
        float productPrice = Float.parseFloat(request.getParameter("productPrice"));
        int productID = Integer.parseInt(request.getParameter("productID"));
        int quantity = Integer.parseInt(request.getParameter("quantity"));
        String productDetail = request.getParameter("detailProduct");

        if (part.getSize() == 0) {
            // Người dùng không chọn hình ảnh
            if (ProductDAO.INSTANCE.updateProductByIDNotImage(productID, productName, categoryId, brandId, productPrice, quantity)) {
                response.sendRedirect(request.getServletContext().getContextPath() + "/product");
                return;
            } else {
                // Xử lý trường hợp cập nhật không thành công
            }
        } else {
            // Người dùng đã chọn hình ảnh
            String imagePath = null;
            try {
                // Đường dẫn lưu ảnh
                String path = request.getServletContext().getRealPath("/images");
                File dir = new File(path);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                File image = new File(dir, part.getSubmittedFileName());
                part.write(image.getAbsolutePath());
                imagePath = request.getContextPath() + "/images/" + image.getName();
            } catch (Exception e) {
                // Xử lý nếu có lỗi khi lưu ảnh
                e.printStackTrace();
            }

            if (ProductDAO.INSTANCE.updateProductByIDWithImage(productID, productName, categoryId, brandId, productPrice, imagePath, quantity)) {
                response.sendRedirect(request.getServletContext().getContextPath() + "/product");
                return;
            } else {
                // Xử lý trường hợp cập nhật không thành công
            }
        }
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

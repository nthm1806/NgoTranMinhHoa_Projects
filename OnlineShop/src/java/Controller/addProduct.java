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
@WebServlet(name = "addProduct", urlPatterns = {"/addProduct"})
public class addProduct extends HttpServlet {

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
            out.println("<title>Servlet addProduct</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet addProduct at " + request.getContextPath() + "</h1>");
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
        ArrayList<Category> categoryList = CategoryDAO.INSTANCE.getCategoryList();
        ArrayList<Brand> brandList = BrandDAO.INSTANCE.getBrandList();
        request.setAttribute("categoryList", categoryList);
        request.setAttribute("brandList", brandList);
        requestDispatcher = request.getRequestDispatcher("addProduct.jsp");
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
        String imagePath = null;
        String imageFileName = null;
        try {
            Part part = request.getPart("image");

            //đường dẫn lưu ảnh
            String path = request.getServletContext().getRealPath("/images");
            File dir = new File(path);
            //ko có đường dẫn => tự tạo ra
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File image = new File(dir, part.getSubmittedFileName());
            System.out.println(image.getParent());
            part.write(image.getAbsolutePath());
            imagePath = request.getContextPath() + "/images/" + image.getName();

            //Luu anh  
            Part file = request.getPart("image");//giai doan nhap anh
            imageFileName = file.getSubmittedFileName();

//                    String uploadFile = "D:/FULearning/Semester IV/PRJ301/foodReview/web/images/" + imageFileName;
            String uploadFile = request.getContextPath() + "/images/" + imageFileName;

            FileOutputStream fos = new FileOutputStream(uploadFile);
            InputStream is = file.getInputStream();
            System.out.println(is);
            try {
                byte[] data = new byte[is.available()];
                is.read(data);
                fos.write(data);
                fos.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
            //ketthuc

            System.out.println(imagePath);
        } catch (Exception e) {
            e.printStackTrace();
        }

        String productName = request.getParameter("productName");
        int categoryId = Integer.parseInt(request.getParameter("categoryID"));
        int brandId = Integer.parseInt(request.getParameter("brandID"));
        float productPrice = Float.parseFloat(request.getParameter("productPrice"));

        int quantity = Integer.parseInt(request.getParameter("quantity"));
        String productDetail = request.getParameter("detailProduct");
        if (ProductDAO.INSTANCE.addProduct(productName, categoryId, brandId, productPrice, imagePath, productDetail,quantity)) {
            response.sendRedirect(request.getServletContext().getContextPath() + "/product");
        } else {
            response.sendRedirect(request.getServletContext().getContextPath() + "/addProduct");
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

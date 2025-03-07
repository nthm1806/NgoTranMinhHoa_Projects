<%-- 
    Document   : productListAdmin
    Created on : Mar 12, 2024, 10:10:57 PM
    Author     : Admin
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cartegories</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="./css/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
              integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
              crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <style>
            button {
                background-color: #FE980F;
                color: white;
                padding: 10px 20px;
                border: none;
                /* Không có đường viền */
                border-radius: 5px;
                /* Bo góc */
                cursor: pointer;
                /* Con trỏ khi di chuột vào */
                font-size: 20px;
                /* Kích thước chữ */
            }

            button:hover {
                background-color: #45a049;
                /* Màu nền thay đổi */
            }
        </style>
    </head>
    <body>
        <jsp:include page="headerAdmin.jsp" />

        <section>
            <div class="row h-100">
                <div class="col-md-2 h-90 left-nav-admin p-0">
                    <div class="p-5 pe-0">
                        <ul>
                            <li class="py-4 ps-3 mb-3">
                                <a href="home" class="fs-2 text-white d-flex align-items-center">
                                    <i class='bx bx-line-chart me-3'></i>
                                    <span>Shop</span>
                                </a>
                            </li>
                            <li class="py-4 ps-3 mb-3">
                                <a href="userManage" class="fs-2 text-white">
                                    <i class='bx bx-cart me-3'></i>
                                    <span>List Users</span>
                                </a>
                            </li>
                            <li class="py-4 ps-3 mb-3 active">
                                <a href="product" class="fs-2 text-white d-flex align-items-center">
                                    <i class='bx bxs-data me-3'></i>
                                    <span>Products</span>
                                </a>
                            </li>
                            <li class="py-4 ps-3 mb-3">
                                <a href="orderManage" class="fs-2 text-white">
                                    <i class='bx bx-cart me-3'></i>
                                    <span>Order</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-10 h-100 manage-product">
                    <h1 class="fw-bold my-4">Product List</h1>
                    <div class="row mt-5 ">
                        <div class="col-4">
                            <form action="searchProduct" method="GET"> <!-- Thay 'your_action_url' bằng URL của action bạn muốn gửi form đến -->
                                <div class="input-box">
                                    <div class="search-icon">
                                        <i class='bx bx-search'></i>
                                    </div>
                                    <div class="search-input">
                                        <input type="text" name="productName" placeholder="Search for products name" aria-label="Example text with button addon">
                                    </div>
                                    <button type="submit" style="color: white; cursor: pointer;">Search</button> <!-- Thêm type="submit" để nút button có thể gửi form đi -->
                                </div>
                            </form>
                        </div>
                        <div class="col-4">
                            <button><a href="addProduct" style="color: white">Add More Product</a></button>
                        </div>
                        <div class="col-4">
                            <div class="box-procees_order">
                                <div class="filter-order_btn">
                                    <i class='bx bx-slider'></i>
                                    <span>Filter</span>
                                    <div class="box-filter_order">
                                        <form action="filterProduct" method="POST">
                                            <h2>Category</h2>
                                            <div class="panel-group category-products" id="accordian">
                                                <c:forEach var="category" items="${categoryList}">
                                                    <input type="radio" name="categoryID" value="${category.getCategoryID()}" 
                                                           <c:if test="${category.getCategoryID() == categoryID}">checked</c:if>>
                                                    ${category.getCategoryName()}<br>
                                                </c:forEach>
                                            </div>

                                            <div class="brands_products">
                                                <h2>Brands</h2>
                                                <div class="brands-name">
                                                    <ul class="nav nav-pills nav-stacked">
                                                        <c:forEach var="brand" items="${brandList}">
                                                            <li>
                                                                <input type="radio" id="${brand.getBrandID()}" name="brandID" value="${brand.getBrandID()}" 
                                                                       <c:if test="${brand.getBrandID() == brandID}">checked</c:if>>
                                                                <label for="${brand.getBrandID()}">${brand.getBrandName()}</label>
                                                            </li>
                                                        </c:forEach>
                                                    </ul>
                                                </div>
                                            </div>

                                            <input type="submit" class="btn btn-default check_out" value="Find">
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5">
                        <table class="table table-striped" > <!-- Thay đổi kích thước bảng -->
                            <thead class="bg-weak">
                                <tr class="rounded-lg">
                                    <th scope="col" style="width: 10%;">ID <a href=""><i class="bx bx-sort-down text-black-weak"></i></a></th> <!-- Tùy chỉnh kích thước của cột ID -->
                                    <th class="d-none d-md-table-cell text-center" scope="col" style="width: 15%;">Image</th> <!-- Tùy chỉnh kích thước của cột Image -->
                                    <th scope="col" style="width: 20%;">Name <a href=""><i class="bx bx-sort-down text-black-weak"></i></a></th> <!-- Tùy chỉnh kích thước của cột Name -->
                                    <th scope="col" style="width: 15%;">Category</th>
                                    <th scope="col" style="width: 15%;">Brand</th>
                                    <th scope="col" style="width: 15%;">Sell Price <a href=""><i class="bx bx-sort-down text-black-weak"></i></a></th>
                                    <th scope="col" style="width: 10%;">Quantity <a href=""><i class="bx bx-sort-down text-black-weak"></i></a></th>
                                    <th class="d-none d-md-table-cell" scope="col" style="width: 10%;">Setting</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="product" items="${productList}">
                                    <tr>
                                        <td style="width: 10%;">${product.getProductID()}</td> <!-- Tùy chỉnh kích thước của cột ID -->
                                        <td class="d-none d-md-table-cell" style="width: 15%;">

                                            <img src="${product.getImage()}" alt="">

                                        </td> <!-- Tùy chỉnh kích thước của cột Image -->
                                        <td style="width: 20%;">${product.getProductName()}</td> <!-- Tùy chỉnh kích thước của cột Name -->
                                        <td style="width: 15%;">${product.getCategory().getCategoryName()}</td>
                                        <td style="width: 15%;">${product.getBrand().getBrandName()}</td>
                                        <td style="width: 15%;"><span class="text-danger fw-bold manage-dis_text">10000</span> ${product.getProductPrice()}</td>
                                        <td style="width: 10%;">${product.getQuantity()}</td>
                                        <td class="d-none d-md-table-cell" style="width: 10%;">
                                            <a href="updateProduct?productID=${product.getProductID()}" class="me-4 text-info fw-bold fs-5">Update</a>
                                            <a href="deleteProduct?productID=${product.getProductID()}" class="me-4 text-info fw-bold fs-5">Delete</a>
                                        </td> <!-- Tùy chỉnh kích thước của cột Setting -->
                                    </tr>
                                </c:forEach>

                            </tbody>
                        </table>
                    </div>

                    <!-- ======= Hien thi phan trang phia frontend ======= -->
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <c:if test="${empty index or index eq 1}"> <!-- CONSIDER INDEX EQUAL 1 ==> DISABLE PREVIOUS -->
                                <li class="page-item disabled">
                                    <a class="page-link" href="#">Previous</a>
                                </li>
                            </c:if>
                            <c:if test="${not (empty index or index eq 1)}"> 
                                <li class="page-item">
                                    <a class="page-link" href="filterProduct?index=${i-1}&categoryID=${categoryID}&brandID=${brandID}">Previous</a>
                                </li>
                            </c:if>

                            <c:forEach begin="1" end="${endPage}" var="i">
                                <c:set var="activeClass" value="${(not empty index and index eq i) ? 'active' : ''}"/>
                                <li class="page-item ${activeClass}">
                                    <a class="page-link" href="filterProduct?index=${i}&categoryID=${categoryID}&brandID=${brandID}">${i}</a>
                                </li>
                            </c:forEach>

                            <c:if test="${empty index or index eq endPage}"> <!-- CONSIDER INDEX EQUAL ENDP ==> DISABLE NEXT -->
                                <li class="page-item disabled">
                                    <a class="page-link" href="#">Next</a>
                                </li>
                            </c:if>

                            <c:if test="${index < endPage}">
                                <li class="page-item">
                                    <a class="page-link" href="filterProduct?index=${i+1}&categoryID=${categoryID}&brandID=${brandID}">Next</a>
                                </li>
                            </c:if>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </section>
    <section id="footer" class="mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 position-relative">
                    <h4 class="fw-bold mb-4">Contact</h4>
                    <p class="fs-4"><strong>Address:</strong> 562 Wellington Road Street 32, San Fransica</p>
                    <p class="fs-4"><strong>Phone:</strong> +01 2222 365 /(+91) 01 2345 6329</p>
                    <p class="fs-4"><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
                    <div class="follow">
                        <h4>Follow Us</h4>
                        <div class="icons mt-5">
                            <i class="bx bxl-facebook me-2 fs-3"></i>
                            <i class="bx bxl-twitter me-2 fs-3"></i>
                            <i class="bx bxl-instagram me-2 fs-3"></i>
                            <i class="bx bxl-pinterest-alt me-2 fs-3"></i>
                            <i class="bx bxl-youtube me-2 fs-3"></i>
                        </div>
                    </div>
                    <a href="homepage.html">
                        <div class="footer-logo">
                            <img src="images/home/logo.png" class="" alt="">
                        </div>
                    </a>
                </div>
                <div class="col-md-2">
                    <h4 class="fw-bold mb-4">SERVICE</h4>
                    <ul>
                        <li><a href="#">Online Help</a></li>
                        <li><a href="#">Contact us</a></li>
                        <li><a href="#">Order Status</a></li>
                        <li><a href="#">Change Location</a></li>
                        <li><a href="#">FAQs</a></li>
                    </ul>
                </div>
                <div class="col-md-2">
                    <h4 class="fw-bold mb-4">QUOCK SHOP</h4>
                    <ul>
                        <li><a href="#">T-Shirt</a></li>
                        <li><a href="#">Mens</a></li>
                        <li><a href="#">Womens</a></li>
                        <li><a href="#">Gift Cards</a></li>
                        <li><a href="#">Shoes</a></li>
                    </ul>
                </div>
                <div class="col-md-2">
                    <h4 class="fw-bold mb-4">POLICES</h4>
                    <ul>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Privecy Policy</a></li>
                        <li><a href="#">Refund Policy</a></li>
                        <li><a href="#">Biling System</a></li>
                        <li><a href="#">Ticket System</a></li>
                    </ul>
                </div>
                <div class="col-md-2">
                    <h4 class="fw-bold mb-4">ABOUT SHOPPER</h4>
                    <ul>
                        <li><a href="#">Company Information</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Store Location</a></li>
                        <li><a href="#">Affiliate Program</a></li>
                        <li><a href="#">Copyright</a></li>
                    </ul>
                </div>
                <div class="col-12">
                    <div class="copyright text-center">
                        <hr>
                        <p class="copyright">@ 2021, Tech2 etc - HTML CSS Ecoomerce Template</p>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <div class='modal' tabindex='-1' id='importModal'>
        <div class='modal-dialog'>
            <div class='modal-content p-4'>
                <div class="row">
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <h3 class="mb-0">Danh sách được nhập: </h3>
                            <strong class="fs-2 fw-bold ms-4">250 (Sản nhập)</strong>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="text-end">
                            <button class="border-0 px-5 py-2 rounded-md fs-4" data-bs-dismiss='modal'>Cancel</button>
                            <button class="border-0 px-5 py-2 rounded-md fs-4 bg-danger text-white ms-4">Save</button>
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="row gx-5 gap-sm-0">
                        <div class="col-12 col-sm-4 col-md-12 mt-5 transition-item">
                            <div
                                class="row position-relative fs-4 px-3 py-4 d-flex align-items-center justify-content-between bg-white rounded-lg border">
                                <div class="col-sm-12 col-md-1">#123</div>
                                <div class="col-sm-12 col-md-1">
                                    <a href="" class="d-block">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/30/638054220350691584_ip-14-pro-max-tim-1.jpg"
                                             alt="">
                                    </a>
                                </div>
                                <div class="col-sm-12 col-md-2">iPhone 14 Pro Max 256GB</div>
                                <div class="col-md-2 col-sm-6">2.965.000đ</div>
                                <div class="col-md-1 col-sm-12">Iphone14</div>
                                <div class="col-sm-12 col-md-1">
                                    <span class="text-danger fw-bold manage-dis_text">Soled: </span>10
                                </div>
                                <div class="col-md-1 col-sm-12 fs-5">
                                    <span class="text-danger fw-bold manage-dis_text fs-4">Add date:</span>20/10/2023
                                </div>
                                <div class="col-sm-6 col-md-1">
                                    <label class="active_product">
                                        <input type="checkbox" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <div class="text-center d-flex">
                                        <a href="" class=" me-4 text-info fw-bold fs-5">Update</a>
                                        <a class="me-4 text-success fw-bold fs-5 preview-btn" data-bs-toggle="modal"
                                           data-bs-target="#preview">
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4 col-md-12 mt-5 transition-item">
                            <div
                                class="row position-relative fs-4 px-3 py-4 d-flex align-items-center justify-content-between bg-white rounded-lg border">
                                <div class="col-sm-12 col-md-1">#123</div>
                                <div class="col-sm-12 col-md-1">
                                    <a href="" class="d-block">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/30/638054220350691584_ip-14-pro-max-tim-1.jpg"
                                             alt="">
                                    </a>
                                </div>
                                <div class="col-sm-12 col-md-2">iPhone 14 Pro Max 256GB</div>
                                <div class="col-md-2 col-sm-6">2.965.000đ</div>
                                <div class="col-md-1 col-sm-12">Iphone14</div>
                                <div class="col-sm-12 col-md-1">
                                    <span class="text-danger fw-bold manage-dis_text">Soled: </span>10
                                </div>
                                <div class="col-md-1 col-sm-12 fs-5">
                                    <span class="text-danger fw-bold manage-dis_text fs-4">Add date:</span>20/10/2023
                                </div>
                                <div class="col-sm-6 col-md-1">
                                    <label class="active_product">
                                        <input type="checkbox" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <div class="text-center d-flex">
                                        <a href="" class=" me-4 text-info fw-bold fs-5">Update</a>
                                        <a class="me-4 text-success fw-bold fs-5 preview-btn" data-bs-toggle="modal"
                                           data-bs-target="#preview">
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4 col-md-12 mt-5 transition-item">
                            <div
                                class="row position-relative fs-4 px-3 py-4 d-flex align-items-center justify-content-between bg-white rounded-lg border">
                                <div class="col-sm-12 col-md-1">#123</div>
                                <div class="col-sm-12 col-md-1">
                                    <a href="" class="d-block">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/30/638054220350691584_ip-14-pro-max-tim-1.jpg"
                                             alt="">
                                    </a>
                                </div>
                                <div class="col-sm-12 col-md-2">iPhone 14 Pro Max 256GB</div>
                                <div class="col-md-2 col-sm-6">2.965.000đ</div>
                                <div class="col-md-1 col-sm-12">Iphone14</div>
                                <div class="col-sm-12 col-md-1">
                                    <span class="text-danger fw-bold manage-dis_text">Soled: </span>10
                                </div>
                                <div class="col-md-1 col-sm-12 fs-5">
                                    <span class="text-danger fw-bold manage-dis_text fs-4">Add date:</span>20/10/2023
                                </div>
                                <div class="col-sm-6 col-md-1">
                                    <label class="active_product">
                                        <input type="checkbox" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <div class="text-center d-flex">
                                        <a href="" class=" me-4 text-info fw-bold fs-5">Update</a>
                                        <a class="me-4 text-success fw-bold fs-5 preview-btn" data-bs-toggle="modal"
                                           data-bs-target="#preview">
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4 col-md-12 mt-5 transition-item">
                            <div
                                class="row position-relative fs-4 px-3 py-4 d-flex align-items-center justify-content-between bg-white rounded-lg border">
                                <div class="col-sm-12 col-md-1">#123</div>
                                <div class="col-sm-12 col-md-1">
                                    <a href="" class="d-block">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/30/638054220350691584_ip-14-pro-max-tim-1.jpg"
                                             alt="">
                                    </a>
                                </div>
                                <div class="col-sm-12 col-md-2">iPhone 14 Pro Max 256GB</div>
                                <div class="col-md-2 col-sm-6">2.965.000đ</div>
                                <div class="col-md-1 col-sm-12">Iphone14</div>
                                <div class="col-sm-12 col-md-1">
                                    <span class="text-danger fw-bold manage-dis_text">Soled: </span>10
                                </div>
                                <div class="col-md-1 col-sm-12 fs-5">
                                    <span class="text-danger fw-bold manage-dis_text fs-4">Add date:</span>20/10/2023
                                </div>
                                <div class="col-sm-6 col-md-1">
                                    <label class="active_product">
                                        <input type="checkbox" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <div class="text-center d-flex">
                                        <a href="updateProduct" class=" me-4 text-info fw-bold fs-5">Update</a>
                                        <a class="me-4 text-success fw-bold fs-5 preview-btn" data-bs-toggle="modal"
                                           data-bs-target="#preview">
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4 col-md-12 mt-5 transition-item">
                            <div
                                class="row position-relative fs-4 px-3 py-4 d-flex align-items-center justify-content-between bg-white rounded-lg border">
                                <div class="col-sm-12 col-md-1">#123</div>
                                <div class="col-sm-12 col-md-1">
                                    <a href="" class="d-block">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/30/638054220350691584_ip-14-pro-max-tim-1.jpg"
                                             alt="">
                                    </a>
                                </div>
                                <div class="col-sm-12 col-md-2">iPhone 14 Pro Max 256GB</div>
                                <div class="col-md-2 col-sm-6">2.965.000đ</div>
                                <div class="col-md-1 col-sm-12">Iphone14</div>
                                <div class="col-sm-12 col-md-1">
                                    <span class="text-danger fw-bold manage-dis_text">Soled: </span>10
                                </div>
                                <div class="col-md-1 col-sm-12 fs-5">
                                    <span class="text-danger fw-bold manage-dis_text fs-4">Add date:</span>20/10/2023
                                </div>
                                <div class="col-sm-6 col-md-1">
                                    <label class="active_product">
                                        <input type="checkbox" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="col-sm-6 col-md-2">
                                    <div class="text-center d-flex">
                                        <a href="" class=" me-4 text-info fw-bold fs-5">Update</a>
                                        <a class="me-4 text-success fw-bold fs-5 preview-btn" data-bs-toggle="modal"
                                           data-bs-target="#preview">
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="paging mt-5">
                    <div class="paging-box d-flex">
                        <span class="prev-paging"><i class='bx bx-chevron-left unclick'></i></span>
                        <span class="number-paging current-paging">1</span>
                        <span class="number-paging">2</span>
                        <span class="number-paging">3</span>
                        <span class="number-paging">4</span>
                        <span class="next-paging"><i class='bx bx-chevron-right'></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class='modal' tabindex='-1' id='exampleModal'>
        <div class='modal-dialog'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <h5>Xóa sản phẩm?</h5>
                    <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                </div>
                <div class='modal-body'>
                    Bạn chắc chắn chắn muốn xóa sản phẩm: <p class='modal-title text-danger fs-3 fw-bold'></p>
                </div>
                <div class='modal-footer'>
                    <button type='button' class='btn btn-danger' id="btn-delete-course">Xóa bỏ</button>
                    <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Hủy</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
    crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <!-- <script src="./js/app.js"></script> -->
    <script>
        $('#exampleModal').on('show.bs.modal', function (event) {
            $('body').addClass('hiddenPadding');
            var button = $(event.relatedTarget) // Button that triggered the modal
            var recipient = button.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            modal.find('.modal-title').text(recipient)
            modal.find('.modal-body input').val(recipient)
        });

        const filterBandBtn = document.querySelector('.filter-brand_btn')
        filterBandBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            filterBandBtn.classList.toggle('showDetail');
        })
        const boxBrand = document.querySelector('.box-brand');
        boxBrand.addEventListener('click', function (e) {
            e.preventDefault();
        });

        const filterBrandValue = document.querySelectorAll('.filter-brand_value');
        const filterBrandChoices = document.getElementById('filter-brand_choices');
        filterBrandValue.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                filterBrandChoices.value = item.innerHTML;
                console.log(item.innerHTML);
            })
        })
    </script>
</body>
</html>

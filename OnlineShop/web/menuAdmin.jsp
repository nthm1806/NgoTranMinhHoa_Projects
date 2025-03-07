<%-- 
    Document   : menuAdmin
    Created on : Mar 13, 2024, 5:03:48 PM
    Author     : Admin
--%>

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
                            <li class="py-4 ps-3 mb-3">
                                <a href="product" class="fs-2 text-white d-flex align-items-center">
                                    <i class='bx bxs-data me-3'></i>
                                    <span>Products</span>
                                </a>
                            </li>
                            <li class="py-4 ps-3 mb-3 active">
                                <a href="orderManage" class="fs-2 text-white">
                                    <i class='bx bx-cart me-3'></i>
                                    <span>Order</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
    </body>
</html>

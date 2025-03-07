<%-- 
    Document   : headerAdmin
    Created on : Mar 12, 2024, 10:12:14 PM
    Author     : Admin
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
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
    <section id="header">
        <div class="container h-100">
            <div class="row align-items-center h-100">
                <div class="col-sm-1 col-md-3 logo-box">
                    <div class="header-logo">
                        <a href="home">
                            <span class="header-logo_name">E-SHOPPER</span>
                            <img src="images/home/logo.png" alt="">
                        </a>
                    </div>
                </div>
                

                <div class="col-sm-5 col-md-4 nav-menu_box">
                    <div class="row">

                        <div class="col">
                            <a href="home" style="color: white">
                                <div class="message-status">
                                    <div class="bell-logo">
                                        <i class='bx bx-home'></i>
                                    </div>
                                    <a href="/home" class="love-title">Home</a>

                                </div>
                            </a>
                        </div>


                        <div class="col">
                            <a href="logout" class="d-block">
                                <div class="cart-status">
                                    <div class="cart-logo">
                                        <i class='bx bx-log-out'></i>
                                    </div>
                                    <span class="cart-title">Logout</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</html>

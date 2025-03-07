<%-- 
    Document   : register
    Created on : Mar 3, 2024, 4:11:23 PM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đăng ký giỏ hàng</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f7f7f7;
                background-image: url('https://i.pinimg.com/564x/09/4a/d9/094ad984afb1d39d2758dc214970efbb.jpg');
                background-size: cover; /* Đảm bảo rằng ảnh nền phủ kín toàn bộ trang */
                background-position: center; /* Căn giữa ảnh nền */
            }

            .header, .footer {
                text-align: center;
                padding: 10px 0;
                background-color: #FE980F; /* màu cam */
                color: white;
                margin-bottom: 20px;
            }

            .footer{
                margin-top: 135px;
            }

            .container {
                width: 500px;
                margin: 20px auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 10px;
                background-color: #fff;
                margin-top: 100px;
            }

            h1 {
                text-align: center;
                font-size: 24px;
                margin-top: 0;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                outline: none;
            }
            .button {
                width: 100%;
                padding: 10px;
                background-color: #FE980F; /* màu cam */
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            }
            .link {
                text-align: center;
                display: block;
                margin-top: 10px;
                color: #0073b7;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <h2><a href="home" style="color: white; text-decoration: none;">Eshopper</a></h2>
        </header>

        <div class="container">
            ${err}
            <h1>Đăng ký</h1>
            <form id="registerForm" action="register" method="post" onsubmit="return validateForm()">
                <div class="form-group">
                    <label for="userName" class="label">Họ và tên</label>
                    <input type="text" id="userName" name="userName" class="input" required>
                </div>
                <div class="form-group">
                    <label for="email" class="label">Tên người dùng</label>
                    <input type="email" id="email" name="email" class="input" required>
                </div>
                <div class="form-group">
                    <label for="password" class="label">Mật khẩu</label>
                    <input type="password" id="password" name="password" class="input" required>
                </div>
                <div class="form-group">
                    <label for="confirm_password" class="label">Xác nhận mật khẩu</label>
                    <input type="password" id="confirm_password" name="confirm_password" class="input" required>
                    <span id="message"></span>
                </div>
                <button type="submit" class="button">Đăng ký</button>
            </form>

            <script>
                function validateForm() {
                    var password = document.getElementById("password").value;
                    var confirm_password = document.getElementById("confirm_password").value;

                    if (password != confirm_password) {
                        document.getElementById("message").innerHTML = "Mật khẩu không khớp!";
                        return false; // Chặn người dùng nộp form
                    }
                    return true; // Cho phép người dùng nộp form
                }
            </script>


            <a href="login.jsp" class="link">Bạn đã có tài khoản? Đăng nhập</a>
        </div>

        <footer class="footer">
            <p>© 2024 Bản quyền thuộc về Đăng ký giỏ hàng</p>
        </footer>
    </body>
</html>

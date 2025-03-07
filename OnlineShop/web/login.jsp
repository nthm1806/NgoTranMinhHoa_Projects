<%-- 
    Document   : login
    Created on : Mar 3, 2024, 4:08:58 PM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trang web của bạn</title>
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
    }

    .footer{
      margin-top: 200px;
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
    .form-group {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
    }
    .input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      outline: none;
    }
    .button {
      padding: 10px;
      background-color: #FE980F; 
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 10px; /* khoảng cách giữa các nút */
    }
    .button-block {
      width: calc(50% - 10px);
    }
    .buttons {
      display: flex;
      justify-content: space-between;
    }
    .link {
      display: block;
      margin: 10px 0;
      text-align: right;
      color: #0073b7;
    }
  </style>
</head>
<body>
  <header class="header">
    <h2><a href="home" style="color: white; text-decoration: none;">Eshopper</a></h2>
  </header>

  <div class="container">
    <h1>Đăng nhập</h1> 
    <form action="login" method="POST">
      <div class="form-group">
        <label for="email" class="label">Tên người dùng</label>
        <input type="text" id="email" name="email" class="input" required>
      </div>
      <div class="form-group">
        <label for="password" class="label">Mật khẩu</label>
        <input type="password" id="password" name="password" class="input" required>
      </div>
      
      <div class="buttons">
        <button type="submit" class="button button-block">Đăng nhập</button>
        <!-- Nút Đăng ký chuyển hướng đến trang đăng ký -->
        <button type="button" class="button button-block" onclick="window.location.href='register.jsp'">Đăng ký</button>
      </div>
    </form>
  </div>

  <footer class="footer">
    <p>© 2024 Trang web của bạn. Mọi quyền được bảo lưu.</p>
  </footer>
</body>
</html>

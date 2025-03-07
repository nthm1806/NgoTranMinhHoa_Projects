<%-- 
    Document   : fortgotPass
    Created on : Mar 3, 2024, 4:15:32 PM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác Minh Email</title>
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
      font-size: 24px;
    }

    footer{
    margin-top: 330px;  
    }

    .container {
      width: 500px;
      margin: 50px auto;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
    }
    h2 {
      color: #333;
      text-align: center;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .label {
      display: block;
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
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }
    .verify-button {
      background-color: #FE980F;
      color: #fff;
    }
  </style>
</head>
<body>
  <header class="header">
    <h2><a href="home" style="color: white; text-decoration: none;">Eshopper</a></h2>
  </header>

  <div class="container">
    <h2>Xác Minh Email</h2>
    <form action="reset-password.html" method="post">
      <div class="form-group">
        <label for="email" class="label">Email</label>
        <input type="email" id="email" name="email" class="input" required>
      </div>
      <button type="submit" class="button verify-button">Verify email</button>
    </form>
  </div>

  <footer class="footer">
    &copy; 2024 Your Website
  </footer>
</body>
</html>

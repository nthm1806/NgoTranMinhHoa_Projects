<%-- 
    Document   : addProduct
    Created on : Mar 13, 2024, 12:25:55 PM
    Author     : Admin
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Insert product</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <link rel="stylesheet" href="./css/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
              integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
              crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>


    </head>
    <body>
        <jsp:include page="headerAdmin.jsp" />
        <form action="updateUser" method="post">
            <section class="bg-weak">
                <div class="container bg-white">
                    <div class="row px-5">
                        <div class="col-md-5 mt-5">
                            <div class="row">
                                <div class="col-12">


                                </div>

                            </div>
                        </div>
                        <div class="col-md-7 mt-5">
                            <div>
                                <h1 class="my-5 fw-bold"> Information Of User</h1>
                                <div class="text-center">
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="userID">User ID</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="userID" name="userID" value="${user.getUserID()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="UserID" readonly />
                                        </div>
                                    </div>
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="user-name">Full Name</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="user-name" name="userName" value="${user.getUserName()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="Full name" />
                                        </div>
                                    </div>
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="user-name">Username</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="user-name" name="email" value="${user.getEmail()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="Username" disabled />
                                        </div>
                                    </div>
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="user-name">Password</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="user-name" name="password" value="${user.getPassword()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="Password" disabled />
                                        </div>
                                    </div>


                                    <div class="row align-items-center mt-5">
                                        <div class="col-md-2 text-end px-3">
                                            <label class="fs-4" for="roleID">Role</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-select py-3 fs-3" name="roleID" aria-label="Select Role">
                                                <c:forEach var="role" items="${roleList}">
                                                    <option value="${role.getRoleID()}" <c:if test="${role.getRoleID() eq user.getRole().getRoleID()}">selected</c:if>>
                                                        ${role.getRoleName()}
                                                    </option>
                                                </c:forEach>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Default Phone</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="product-name" name="defaultPhone" value="${user.getDefaultPhone()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="" disabled/>
                                    </div>
                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Default Address</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="product-name" name="defaultAddress" value="${user.getDefaultAddress()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="" disabled/>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div class="button-container">
                        <button type="submit" class="px-5 py-3 bg-success text-white border-0 fs-3 rounded-md">Update</button>
                        <button class="ms-5 px-5 py-3 bg-danger text-white border-0 fs-3 rounded-md"><a href="userManage" style="color: white">Cancel</a></button>
                    </div>
                </div>
            </section>
        </form>
        <script src="ckeditor/ckeditor.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery"></script>


        <script>
            CKEDITOR.replace('editor1');


        </script>
    </body>
</html>

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
        <form action="updateOrder" method="post">
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
                                <h1 class="my-5 fw-bold"> Information Of Order</h1>
                                <div class="text-center">
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="userID">Order ID</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="userID" name="orderID" value="${order.getOrderID()}" class="rounded-sm border w-100 fs-3 py-4 px-3" readonly/>
                                        </div>
                                    </div>
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="user-name">User Email</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="user-name" name="email" value="${order.getUser().getEmail()}" class="rounded-sm border w-100 fs-3 py-4 px-3" disabled />
                                        </div>
                                    </div>
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="user-name">Order Date</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="user-name" name="email" value="${order.getOrder_date()}" class="rounded-sm border w-100 fs-3 py-4 px-3" readonly />
                                        </div>
                                    </div>



                                    <div class="row align-items-center mt-5">
                                        <div class="col-md-2 text-end px-3">
                                            <label class="fs-4" for="roleID">Status</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-select py-3 fs-3" name="statusID" aria-label="Select Status">
                                                <c:forEach var="status" items="${statusList}">
                                                    <option value="${status.getStatusID()}" <c:if test="${status.getStatusID() eq order.getStatus().getStatusID()}">selected</c:if>>
                                                        ${status.getStatusName()}
                                                    </option>
                                                </c:forEach>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Phone</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="product-name" name="phone" value="${order.getPhone()}" class="rounded-sm border w-100 fs-3 py-4 px-3" readonly />
                                    </div>
                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Address</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="product-name" name="address" value="${order.getAddress()}" class="rounded-sm border w-100 fs-3 py-4 px-3" disabled />
                                    </div>
                                </div>
                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="user-name">Total Money</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="user-name" name="totalMoney" value="${order.getTotalMoney()}" class="rounded-sm border w-100 fs-3 py-4 px-3" disabled />
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div class="button-container">
                        <button type="submit" class="px-5 py-3 bg-success text-white border-0 fs-3 rounded-md">Update</button>
                        <button class="ms-5 px-5 py-3 bg-danger text-white border-0 fs-3 rounded-md"><a href="orderManage" style="color: white">Cancel</a></button>
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

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
        <script>
            function inputImage(value) {
                const [input, index] = value
                console.log(value);
                var filePath = input.value;
                var fileName = filePath.split('\\').pop();
                var imagePreview = document.getElementById('boxImage');
                imagePreview.src = "./images/" + fileName;
                console.log(fileName);
            }
        </script>

    </head>
    <body>
        <jsp:include page="headerAdmin.jsp" />
        <form action="updateProduct" method="post" enctype="multipart/form-data">
            <input type="hidden" name="oldImage" value="${oldImage}">
            <section class="bg-weak">
                <div class="container bg-white">
                    <div class="row px-5">
                        <div class="col-md-5 mt-5">
                            <div class="row">
                                <div class="col-12">
                                    <h1 class="my-5 fw-bold">Add Image</h1>
                                    <div class="row-3">
                                        <div style="height: 280px;" class="border-dotted p-5 d-flex flex-column box-input-image w-90 position-relative justify-content-center">
                                            <i class='bx bx-image-add fs-1 text-danger'></i>
                                            <span class="text-danger fs-3">Thêm hình ảnh(1)</span>
                                            <input type="file" accept="image/gif, image/jpeg, image/png" onchange="previewImage(event)" class="form-control w-100 h-100 position-absolute top-0 start-0" style="z-index: 100; opacity: 0;" name="image" placeholder="Enter photo">
                                            <img src="${product.getImage()}" alt="" class="position-absolute start-0" id="boxImage"" />

                                        </div>
                                    </div>

                                    <script>
                                        function previewImage(event) {
                                            var input = event.target;
                                            var reader = new FileReader();

                                            reader.onload = function () {
                                                var dataURL = reader.result;
                                                var imgElement = document.getElementById('boxImage');
                                                imgElement.src = dataURL;
                                            };

                                            reader.readAsDataURL(input.files[0]);
                                        }
                                    </script>

                                </div>
                                <div class="col-12">
                                    <div class="row mt-5 d-flex align-items-center">
                                        <div class="col-md-12 text-start">
                                            <label class="fs-4">Detailed Product Description: </label>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-floating">
                                                <textarea name="detailProduct" id="editor1" rows="10" cols="80" class="w-100">
                                            ${product.getProductDetail()}
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 mt-5">
                            <div>
                                <h1 class="my-5 fw-bold">Add Information Of Product</h1>
                                <div class="text-center">
                                    <div class="row d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="product-id">Product ID</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="product-id" name="productID" value="${product.getProductID()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="Product ID" readonly/>
                                        </div>
                                        <div class="col-md-2 text-end">
                                            <label class="fs-4" for="product-name">Product Name</label>
                                        </div>
                                        <div class="col-md-10 insert-product-input">
                                            <input type="text" id="product-name" name="productName" value="${product.getProductName()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="Product name" required/>
                                        </div>
                                    </div>
                                    <div class=" d-flex align-items-center mt-5">
                                        <div class="col-md-2 text-end px-3">
                                            <label class="fs-4" for="product-type">Category</label>
                                        </div>
                                        <div class="w-100">
                                            <select class="form-select py-3 fs-3" name="categoryID" aria-label="Default select example">
                                                <c:forEach var="category" items="${categoryList}">
                                                    <option value="${category.getCategoryID()}" <c:if test="${category.getCategoryName().equals(product.getCategory().getCategoryName())}">selected</c:if>>
                                                        ${category.getCategoryName()}
                                                    </option>
                                                </c:forEach>
                                            </select>
                                        </div>

                                    </div>

                                    <div class="row align-items-center mt-5">
                                        <div class="col-md-2 text-end px-3">
                                            <label class="fs-4" for="brandID">Brand</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-select py-3 fs-3" name="brandID" aria-label="Select Brand">
                                                <c:forEach var="brand" items="${brandList}">
                                                    <option value="${brand.getBrandID()}" <c:if test="${brand.getBrandID() eq product.getBrand().getBrandID()}">selected</c:if>>
                                                        ${brand.getBrandName()}
                                                    </option>
                                                </c:forEach>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Sell Price</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="text" id="product-name" name="productPrice" value="${product.getProductPrice()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="" required />
                                    </div>
                                </div>

                                <div class="row d-flex align-items-center mt-5">
                                    <div class="col-md-2 text-end">
                                        <label class="fs-4" for="product-name">Quantity</label>
                                    </div>
                                    <div class="col-md-10 insert-product-input">
                                        <input type="number" id="product-name" name="quantity" value="${product.getQuantity()}" class="rounded-sm border w-100 fs-3 py-4 px-3" placeholder="" required/>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div class="button-container">
                        <button type="submit" class="px-5 py-3 bg-success text-white border-0 fs-3 rounded-md">Update</button>
                        <button class="ms-5 px-5 py-3 bg-danger text-white border-0 fs-3 rounded-md"><a href="product" style="color: white">Cancel</a></button>
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

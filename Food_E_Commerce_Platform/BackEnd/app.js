const { sendOTP, verifyOTP } = require('./src/until/SendMail');
const express = require('express');
const Products = require('./src/routers/productRouter')
const orderRouter = require('./src/routers/OrderRouter')
const cartRouter = require('./src/routers/CartRouter')
const VoucherRouter = require('./src/routers/VoucherRouter')
const CustomerRouter = require('./src/routers/CustomerRouter')
const Review = require('./src/routers/ReviewRouter')
const cors = require('cors');
const bodyParser = require('body-parser');
const AddressRouter = require('./src/routers/AddressRouter');
const customerApiRouter = require('./src/routers/APICustomer'); // API mới
const NotificationsRouter = require('./src/routers/NotificationsRouter');
const SubItemRouter = require("./src/routers/SubItemRouter");
const categoryRouter = require("./src/routers/CategoryRouter");
const errorHandler = require("./src/middlewares/errorHandler");
const FAQRouter = require("./src/routers/FAQRouter");
const SupportRouter = require("./src/routers/supportRoutes"); // Router hỗ trợ khách hàng

const ProductFavoriteRouter = require("./src/routers/ProductFavoriteRouter");
const Shipper = require('./src/routers/ShipperRouter')
const VoucherDetailRouter = require("./src/routers/VoucherDetailRouter");
const CustomerShopFollowRouter = require("./src/routers/CustomerShopFollowRouter");
const TransactionRouter = require("./src/routers/TransactionRouter")
const ActivityLogsRouter = require("./src/routers/ActivityLogsRouter");
const ComboProductRouter = require("./src/routers/ComboProductRouter")
const SupportRoutes = require('./src/routers/supportRoutes');


const Shop = require("./src/routers/ShopRouter")

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

// API gửi OTP đến email mới
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    await sendOTP(email);
    res.json({ message: "OTP đã được gửi!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi gửi OTP!" });
  }
});

// API xác minh OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (verifyOTP(email, otp)) {
    res.json({ message: "Xác minh OTP thành công!" });
  } else {
    res.status(400).json({ error: "OTP không hợp lệ!" });
  }
});


app.use('/api/Order', orderRouter)
app.use('/api/Cart', cartRouter)
app.use('/api/Voucher', VoucherRouter)
app.use('/api/Products', Products)
app.use('/api/Review', Review)

// Cấu hình CORS
app.use(
  cors({
    origin: "*", // Chấp nhận tất cả các domain (không an toàn)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Định tuyến API
app.use('/api/Order', orderRouter);
app.use('/api/Shipper',Shipper );
app.use('/api/Cart', cartRouter);
app.use('/api/Voucher', VoucherRouter);
app.use('/api/Products', Products);
app.use("/customers", CustomerRouter);
app.use('/api/customers', customerApiRouter);
app.use('/address', AddressRouter);
app.use('/api/notifications', NotificationsRouter);
app.use("/api/subitems", SubItemRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/faqs", FAQRouter);
app.use("/api/Transaction", TransactionRouter)
app.use("/api/shop", Shop);
app.use("/api/activitylogs", ActivityLogsRouter)
app.use("/api/ProductFavorite", ProductFavoriteRouter);
app.use("/api/VoucherDetail", VoucherDetailRouter);
app.use("/api/CustomerShopFollow", CustomerShopFollowRouter);
app.use("/api/combo-product", ComboProductRouter);
app.use('/api/support', SupportRoutes);

app.use(errorHandler);
app.use("/api/support", SupportRouter); // API hỗ trợ khách hàng
// Cấu hình upload file
app.use("/uploads", express.static("src/uploads"));


// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
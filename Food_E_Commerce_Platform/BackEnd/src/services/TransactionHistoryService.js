const TransactionHistoryModels = require("../models/TransactionHistoryModel");
const Bills = require("../models/BillsModel");
const Customers = require("../models/CustomerModel");
const Order = require("../services/OrderService");
const OrderModel = require("../models/OrderModel");
const CustomerBehavior = require("../models/CustomerBehaviorModel");
const productModel = require("../models/ProductModel");

const TransactionHistory = {
  getTransactionHistory: async (customerID, typeTransactionHistory) => {
    let allOrderIdByCustomer =
      await TransactionHistoryModels.getOrderIDByCustomerID(customerID);
    let allBillIDByCustomer =
      await TransactionHistoryModels.getBillIDByCustomerID(customerID);

    if (typeTransactionHistory !== "Order") {
      const result = await Promise.all(
        allBillIDByCustomer.map(async (item) => {
          const paymentBills = await Bills.getAllBillByBillID(
            item.bill_id,
            typeTransactionHistory
          );

          // Kiểm tra paymentBills có phải là mảng không và có ít nhất một phần tử
          if (!Array.isArray(paymentBills) || paymentBills.length === 0) {
            return []; // Nếu không có dữ liệu, trả về mảng rỗng
          }

          const inforPaymentBillID =
            await TransactionHistoryModels.getInforPaymentBillID(item.bill_id);

          // Kiểm tra inforPaymentBillID có phải là mảng không và có ít nhất một phần tử
          if (
            !Array.isArray(inforPaymentBillID) ||
            inforPaymentBillID.length === 0
          ) {
            return []; // Nếu không có dữ liệu, trả về mảng rỗng
          }

          // Trả về một mảng phẳng từ hai mảng
          return inforPaymentBillID.flatMap((paymentInfo) =>
            paymentBills.map((billInfo) => ({
              payment_id: paymentInfo.payment_id,
              bill_id: paymentInfo.bill_id,
              customer_id: paymentInfo.customer_id,
              payment_amount: paymentInfo.payment_amount,
              payment_date: paymentInfo.payment_date,
              payment_method: paymentInfo.payment_method,
              status: paymentInfo.status,
              img: paymentInfo.img,
              bill_type: billInfo.bill_type,
              thang_nam: billInfo.thang_nam,
              created_at: billInfo.created_at,
              end_date: billInfo.end_date,
              updated_at: billInfo.updated_at,
            }))
          );
        })
      );
      // Dùng flat() để đảm bảo kết quả không chứa mảng lồng nhau
      return result.flat(Infinity);
    }

    const result2 = await Promise.all(
      allOrderIdByCustomer.map(async (item) => {
        const paymentOrderID = await Order.getOrderDetailByOrderID(
          item.order_id
        );
        
        // Kiểm tra paymentOrderID có phải là mảng không và có ít nhất một phần tử
        if (Array.isArray(paymentOrderID) && paymentOrderID.length > 0) {
          const inforPaymentOrderID =
            await TransactionHistoryModels.getInforPaymentOrderID(
              item.order_id
            );

          // Kiểm tra inforPaymentOrderID có phải là mảng không và có ít nhất một phần tử
          if (
            Array.isArray(inforPaymentOrderID) &&
            inforPaymentOrderID.length > 0
          ) {
            // Dùng flatMap để kết hợp các mảng mà không tạo các mảng con
            return paymentOrderID.flatMap((paymentOrder) =>
              inforPaymentOrderID.map((paymentInfo) => ({
                payment_id: paymentInfo.payment_id,
                order_id: paymentInfo.order_id,
                customer_id: paymentInfo.customer_id,
                payment_amountOrder: paymentInfo.payment_amount,
                payment_date: paymentInfo.payment_date,
                payment_method: paymentInfo.payment_method,
                status: paymentInfo.status,
                img: paymentOrder.productImg,
                TotalAmount: paymentOrder.TotalAmount,
                VoucherID: paymentOrder.VoucherID,
                address: paymentOrder.address,
              }))
            );
          } else {
            return []; // Trả về mảng rỗng nếu không có thông tin inforPaymentOrderID
          }
        } else {
          return []; // Trả về mảng rỗng nếu không có paymentOrderID
        }
      })
    );

    return result2.flat(Infinity);
  },

  addBillPayment: async (inforFullUser, item) => {
    const result1 = Customers.addCoinCustomer(inforFullUser, item);
    const result2 = TransactionHistoryModels.addPaymentBill(
      inforFullUser,
      item
    );
    const result3 = Bills.updateStatusBills(item.bill_id, item.bill_type);
    return { result1, result2, result3 };
  },

  addOrderPayment: async (OrderInfor, address, voucherChoose, cusID, totalPayment, OrderDetailID) => {
    const results = [];  // Mảng để lưu kết quả cho từng sản phẩm

    const OrderID = await OrderModel.getOrderByOrderDetailID(OrderDetailID);

    // Duyệt qua từng sản phẩm trong OrderInfor
    for (let item of OrderInfor) {
        const productID = item.productID;
        const category = item.productCategory;
        const Quantity = item.Quantity;
        const type = "purchase";
        const shopID = (await productModel.getProductShopID(productID))[0].ShopID;


        // Gọi các hàm để xử lý mỗi sản phẩm
        const result1 = await CustomerBehavior.addCustomerBehavior(cusID, productID, category, type, shopID);
        const result2 = await TransactionHistoryModels.addOrder(item, totalPayment, cusID, OrderID); // Thực hiện với item hiện tại
        const result3 = await productModel.updateProductStockQuantity(productID, Quantity);
        // Lưu kết quả cho mỗi sản phẩm
        results.push({ result1, result2, result3});
    }

    return results;  // Trả về kết quả của tất cả các sản phẩm
}

};

module.exports = TransactionHistory;

const Orders = require('../models/OrderModel');
const Voucher = require('./VoucherService')
const Cart = require('./CartService')
const Product = require('../models/ProductModel');
const Notification = require('../models/NotificationstModel')
const TransactionHistory = require('../models/TransactionHistoryModel')

const OrderServices = {
    getAllOrder: async ()=>{
        return await Orders.getAllOrders();
    },
    getOrderByCusID:async(cusID)=>{
        return await Orders.getOrderByCusId(cusID)
    },
    addOrder:async (address,OrderInfor,voucher,totalPayment,cusID)=>{
        const OrderID = await Orders.addOrder(address,cusID,totalPayment,OrderInfor,voucher);
        if(OrderInfor[0].CartDetailID){
            await Cart.removeCartDetail(OrderInfor)
        }
        await Product.decreament(OrderInfor);
        if(voucher){
            await Voucher.removeVoucherDetail(cusID,voucher);
        }
        await Notification.addNotifications(cusID,OrderID);
    },
    addOrderPrepay:async (address,OrderInfor,voucher,totalPayment,cusID)=>{
        const result = await Orders.addOrderPrepay(address,cusID,totalPayment,OrderInfor,voucher);
        if(OrderInfor[0].CartDetailID){
            await Cart.removeCartDetail(OrderInfor)
        }
        if(voucher){
            await Voucher.removeVoucherDetail(cusID,voucher);
        }
        await Notification.addNotifications(cusID,result.OrderID);
        
        return result.OrderDetailID;
    },
    getOrderDetailByCusID: async (cusID)=>{
        const OderDetail = await Orders.getOrderDetailByCusID(cusID);
        const result  = await Promise.all(OderDetail.map(async(item)=>{
            const query = await Product.getProductByProID(item.ProductID);
            const tmp = {
                orderID : item.OrderID,
                orderDetailID:item.OrderDetailID,
                productID : item.ProductID,
                stockQuantity:query[0].StockQuantity,
                productCategory:query[0].Category,
                status:item.Status,
                productImg: query[0].ProductImg,
                productName:query[0].ProductName,
                description:query[0].Description,
                productPrice:query[0].Price,
                productImg: query[0].ProductImg,
                Quantity:item.Quantity,
                ShopID:query[0].ShopID,
                discount:item.discount,
                shipperID: item.ShipperID,
                feeShip: 32000,
                totalAmount: item.Quantity * query[0].Price + 32000,
            }
            return tmp;
        }))   
        return result;  
    },
    getOrderDetailByOrderID: async(OrderID)=>{
        const OderDetail = await Orders.getOrderDetailByOrderID(OrderID);
        const result  = await Promise.all(OderDetail.map(async(item)=>{
            const query = await Product.getProductByProID(item.ProductID);
            const tmp = {
                orderID : item.OrderID,
                productID : item.ProductID,
                productCategory:query[0].Category,
                status:item.Status,
                productImg: query[0].ProductImg,
                productName:query[0].ProductName,
                description:query[0].Description,
                productPrice:query[0].Price,
                productImg: query[0].ProductImg,
                Quantity:item.Quantity,
                ShopID:query[0].ShopID,
                discount:item.discount,
                shipperID: item.ShipperID,
                feeShip: 32000,
                totalAmount: item.Quantity * query[0].Price + 32000,
            }
            return tmp;
        }))   
        return result;  
    },
    changeStatusShip: async(OrderDetailID)=>{
        
        Orders.changeStatusShip(OrderDetailID);
    }
}
module.exports = OrderServices;
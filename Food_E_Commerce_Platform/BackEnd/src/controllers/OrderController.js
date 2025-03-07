const OrderServices = require("../services/OrderService");
const Transaction = require('../services/TransactionService')
const axios = require('axios')
require('dotenv').config();

const OrderControllers = {
  getAllOrrders: async (req, res) => {
    try {
      const result = await OrderServices.getAllOrder();
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOrderByCusID: async (req, res) => {
    try {
      const cusID = req.body.cusID;
      const result = await OrderServices.getOrderByCusID(cusID);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addOrder: async (req, res) => {
    try {
      const OrderInfor = req.body.OrderInfor;
      const voucher = req.body.voucherChoose;
      const totalPayment = req.body.totalPayment;
      const cusID = req.body.cusID;
      const address = req.body.address;
      await OrderServices.addOrder(address,OrderInfor, voucher, totalPayment, cusID);
      const result = "success";
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getOrderDetailByCusID: async (req, res) => {
    try {
      const cusID = req.body.cusID;
      const result = await OrderServices.getOrderDetailByCusID(cusID);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  prepay: async (req, res) => {
    try {
      const totalPayment = req.body.totalPayment;
      const OrderInfor  = req.body.OrderInfor;
      const voucherChoose = req.body.voucherChoose;
      const cusID = req.body.cusID;
      const address = req.body.address;
      const url = req.body.url;
      const OrderDetailID = await OrderServices.addOrderPrepay(address,OrderInfor, voucherChoose, totalPayment, cusID);

      var partnerCode = "MOMO";
      var accessKey = process.env.MOMO_ACCESSKEY;
      var secretkey = process.env.MOMO_SECRETKEY;
      var requestId = partnerCode + new Date().getTime();
      var orderId = requestId;
      var orderInfo = "anh đức đẹp trai";
      var redirectUrl = `http://localhost:3000${url}`;
      var ipnUrl = `${process.env.MOMO_IPNURL}/api/Transaction/callback`;
      var amount = `${totalPayment}`;
      var requestType = "captureWallet";
      var extraData = JSON.stringify(OrderDetailID);
      console.log('cmm',url)
      var rawSignature ="accessKey=" +accessKey +"&amount=" +amount +"&extraData=" +extraData +"&ipnUrl=" +ipnUrl +"&orderId=" +orderId +"&orderInfo=" +orderInfo +
        "&partnerCode=" +partnerCode +"&redirectUrl=" +redirectUrl +"&requestId=" +requestId +"&requestType=" +requestType;
      const crypto = require("crypto");
      var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "en",
      });
      const options = {
        url:'https://test-payment.momo.vn/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data:requestBody
    }
      const result = await axios(options)
      console.log(result.data)
      res.status(200).json({ payUrl: result.data.payUrl });
    } catch (error) {
      console.log(error);
    }
  },
  getOrderDetailByOrderID: async(req,res)=>{
    try {
      const OrderID = req.body.OrderID;
      const result = await OrderServices.getOrderDetailByOrderID(OrderID);
      res.status(200).json(result);
    } catch (error) {
      console.log(error)
    }

  }
};
module.exports = OrderControllers;

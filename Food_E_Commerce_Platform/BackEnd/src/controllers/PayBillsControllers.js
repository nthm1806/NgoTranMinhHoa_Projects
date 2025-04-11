const axios = require('axios');
require('dotenv').config();

  const PayBills = {
    postPayBills: async (req, res) => {
      try { 
        const item = req.body.item;
        const inforFullUser = req.body.inforFullUser;
      var partnerCode = "MOMO";
      var accessKey = process.env.MOMO_ACCESSKEY;
      var secretkey = process.env.MOMO_SECRETKEY;
      var requestId = partnerCode + new Date().getTime();
      var orderId = requestId;
      var addCoinValue = Math.ceil((item.bill_amount / 1000) * 0.1);
      var orderInfo =  `✅Bạn được ${addCoinValue} xu`;
      var redirectUrl = `http://localhost:3000/Bills`;
      var ipnUrl = `${process.env.MOMO_IPNURL}/api/Payments/addBillPayment`;
      var amount = `${Number(item.bill_amount)}`;
      var requestType = "captureWallet";
      var extraData =JSON.stringify([inforFullUser,item]);
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
      res.status(200).json({ payUrl: result.data.payUrl });
      } catch (error) {
        console.log(error);
      }
      },
    
  };
  module.exports = PayBills;
  
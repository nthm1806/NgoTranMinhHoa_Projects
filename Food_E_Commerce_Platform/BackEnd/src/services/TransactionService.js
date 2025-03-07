const crypto = require('crypto');
require('dotenv').config();
const axios = require('axios')

const Transaction ={
    checkPayment: async(orderId)=>{
        const rawSignature = `accessKey=${process.env.MOMO_ACCESSKEY}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto.createHmac("sha256",process.env.MOMO_SECRETKEY).update(rawSignature).digest('hex');
        const requestBody = JSON.stringify({
            partnerCode: 'MOMO',
            requestId: orderId,
            orderId:orderId,
            lang: 'vi',
            signature
        })
        const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query',requestBody,{headers:{
        'Content-Type': 'application/json',

        }})
        return result.data.resultCode;
    }
}

module.exports = Transaction
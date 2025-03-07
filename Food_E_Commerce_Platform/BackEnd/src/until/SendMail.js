import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//Khởi tạo transporter với thông tin chính xác
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Lấy từ biến môi trường
        pass: process.env.EMAIL_PASS,  // Lấy từ biến môi trường
    },
});

//Lưu OTP tạm thời trong Map (Nên dùng Redis nếu cần bảo mật)
const otpStorage = new Map();

// gửi OTP
export const sendOTP = async (email) => {
    if (!email) throw new Error("Email không hợp lệ!");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(email, otp); // Lưu OTP

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP xác minh email",
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
};

//xác minh OTP
export const verifyOTP = (email, otp) => {
    if (otpStorage.get(email) === otp) {
        otpStorage.delete(email);
        return true;
    }
    return false;
};

import { transporter } from "../configs/transporter.js";

export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: '"Bee Shop" <no-reply@beeshop.vn>',
    to,
    subject: "Mã OTP xác thực đăng nhập - Bee Shop",
    text: `Xin chào quý khách,

Mã OTP xác thực đăng nhập của quý khách là: ${otp}

Mã này có hiệu lực trong 5 phút. Nếu quý khách không yêu cầu mã này, vui lòng bỏ qua email.

Cảm ơn quý khách đã tin tưởng Bee Shop.

Trân trọng,
Bee Shop
    `,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #f9a825;">Bee Shop</h2>
      <p>Xin chào quý khách,</p>
      <p>Mã <strong>OTP xác thực đăng nhập</strong> của quý khách là:</p>
      <p style="font-size: 28px; font-weight: bold; color: #f57f17; letter-spacing: 4px;">${otp}</p>
      <p>Mã này có hiệu lực trong <strong>5 phút</strong>. Nếu quý khách không yêu cầu mã này, vui lòng bỏ qua email.</p>
      <hr style="border: none; border-top: 1px solid #ddd;" />
      <p>Cảm ơn quý khách đã tin tưởng và đồng hành cùng Bee Shop.</p>
      <p style="font-style: italic; color: #555;">Trân trọng,<br/>Bee Shop</p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

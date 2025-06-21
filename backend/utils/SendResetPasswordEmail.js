import nodemailer from 'nodemailer';

const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: `FoodShare <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Şifrə Sıfırlama Linki',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Salam!</h2>
          <p>Şifrənizi sıfırlamaq üçün aşağıdakı linkə klik edin:</p>
          <a href="${resetUrl}" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#dc3545; color:#fff; text-decoration:none; border-radius:5px;">
            Şifrəni Sıfırla
          </a>
          <p>Əgər bu istəyi siz etməmisinizsə, emaili nəzərə almayın.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Şifrə sıfırlama emaili göndərildi: ${email}`);
  } catch (error) {
    console.error('❌ Şifrə sıfırlama emaili göndərilərkən xəta:', error);
    throw new Error('Email göndərilə bilmədi');
  }
};

export default sendResetPasswordEmail;

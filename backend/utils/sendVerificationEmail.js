// 📁 backend/utils/sendVerificationEmail.js
import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // app password olan email
        pass: process.env.EMAIL_PASS, // app password özü
      },
    });

    const verifyLink = `http://localhost:5173/verify/${token}`;

    const mailOptions = {
      from: `FoodShare <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Təsdiqləmə - FoodShare Platforması',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Salam!</h2>
          <p>Qeydiyyatınızı tamamlamaq üçün aşağıdakı linkə klikləyin:</p>
          <a href="${verifyLink}" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:5px;">
            Hesabımı Təsdiqlə
          </a>
          <p>Əgər siz qeydiyyatdan keçməmisinizsə, bu emaili nəzərə almayın.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email göndərildi: ${email}`);
  } catch (error) {
    console.error('❌ Email göndərilə bilmədi:', error);
    throw new Error('Email göndərilə bilmədi');
  }
};

export default sendVerificationEmail;

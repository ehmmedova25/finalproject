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

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `FoodShare <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Şifrə Sıfırlama',
      html: `
        <h2>Şifrəni sıfırlamaq üçün link:</h2>
        <a href="${resetUrl}" target="_blank">Şifrəni Sıfırla</a>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Reset email error:', error);
    throw new Error('Email göndərilə bilmədi');
  }
};

export default sendResetPasswordEmail;

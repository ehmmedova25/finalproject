
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

  const link = `http://localhost:3000/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Email doğrulama',
    html: `
      <h2>Email təsdiqləmə</h2>
      <p>Zəhmət olmasa hesabınızı təsdiqləmək üçün aşağıdakı linkə klikləyin:</p>
      <a href="${link}">Emaili təsdiqlə</a>
    `
  };

  await transporter.sendMail(mailOptions);
};

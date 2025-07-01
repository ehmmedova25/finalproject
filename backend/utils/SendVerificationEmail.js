import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const mailOptions = {
      from: `FoodShare <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Təsdiqləmə - FoodShare',
      html: `
        <h2>Salam!</h2>
        <p>Emailinizi təsdiqləmək üçün aşağıdakı linkə klikləyin:</p>
        <a href="${verifyLink}" target="_blank">Hesabımı Təsdiqlə</a>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Email göndərilə bilmədi');
  }
};

export default sendVerificationEmail;

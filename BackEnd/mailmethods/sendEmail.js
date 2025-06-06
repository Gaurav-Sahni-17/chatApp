const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.MAIL, 
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Chat App" <${process.env.MAIL}>`,
    to: to,
    subject: subject,
    text: text,
    html: `<p>${text}</p>`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully', result.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

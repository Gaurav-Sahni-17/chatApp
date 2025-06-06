const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: "sahnigaurav17@gmail.com", 
    pass: "exvbfiiyppylftzu",
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Chat App" <"sahnigaurav17@gmail.com">`,
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

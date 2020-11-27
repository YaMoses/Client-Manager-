const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // create reusable transporter 
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASS 
    }
  });

  // send mail with already defined transport object
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EAMIL}>`, // sender address
    to: options.email, // receivers list 
    subject: options.subject, // Subject 
    text: options.message // plain text body
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
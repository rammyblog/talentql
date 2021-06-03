const sgMail = require('@sendgrid/mail');

const sendEmail = async (emailOptions) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send(emailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;

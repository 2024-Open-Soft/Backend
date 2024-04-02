const Transporter = require("nodemailer").createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//function to send email to the user
async function sendingMail({ from, to, subject, text }) {
  try {
    let mailOptions = { from, to, subject, text };

    //return the Transporter variable which has the sendMail method to send the mail which is within the mailOptions
    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendingMail;

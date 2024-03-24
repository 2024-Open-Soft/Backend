const Transporter = require("nodemailer").createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.email || "udayomsrivastava111@gmail.com",
    pass: process.env.emailpassword || "wvzuotypolrqepam",
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

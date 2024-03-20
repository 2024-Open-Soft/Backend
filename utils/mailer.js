//function to send email to the user
async function sendingMail({ from, to, subject, text }) {

    try {
        let mailOptions = ({
            from,
            to,
            subject,
            text
        })
        //assign createTransport method in nodemailer to a variable
        //service: to determine which email platform to use
        //auth contains the senders email and password which are all saved in the .env
        const Transporter = require('nodemailer').createTransport({
            service: "Gmail",
            secure: true,
            auth: {
                user: process.env.email || 'udayomsrivastava111@gmail.com',
                pass: process.env.emailpassword || 'wvzuotypolrqepam',
            },
        });

        //return the Transporter variable which has the sendMail method to send the mail
        //which is within the mailOptions
        return await Transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendingMail;
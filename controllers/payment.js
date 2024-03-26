const Razorpay = require('razorpay')
const crypto = require('crypto')
// const validatePaymentVerification = require('razorpay/dist/utils/razorpay-utils');

const key_id = process.env.key_id
const key_secret = process.env.key_secret
const webhook_secret = process.env.webhook_secret


// const createOrder = async (req, res) => {
//     try {
//         const { amount, currency } = req.body;

//         const razorpayInstance = new Razorpay({
//             key_id: key_id,
//             key_secret: key_secret,
//         });

//         // function to generate random receipt id
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//         function generateString(length) {
//             let result = ' ';
//             const charactersLength = characters.length;
//             for (let i = 0; i < length; i++) {
//                 result += characters.charAt(Math.floor(Math.random() * charactersLength));
//             }
//             return result;
//         }

//         // order details
//         const order = {
//             amount: amount * 100, // amount in smallest currency unit
//             currency: currency,
//             receipt: generateString(15)
//         };

//         // creating the order at razorpay and returning the response
//         const response = await razorpayInstance.orders.create(order)
//         res.status(200).json(response)
//     }
//     catch (err) {
//         res.status(err.status).send(err.message);
//     }
// }

// const verifyOrder = (req, res) => {
//     try {
//         const { order_id, payment_id } = req.body;
//         const razorpay_signature = req.headers['x-razorpay-signature'];

//         const keySecret = key_secret;


//         /* Verification & Send Response to User */

//         // Creating hmac object, Passing the data to be hashed and Creating the hmac in the required format 
//         let hmac = crypto.createHmac('sha256', keySecret);
//         hmac.update(order_id + "|" + payment_id);
//         const generated_signature = hmac.digest('hex');

//         if (razorpay_signature === generated_signature) {
//             res.status(200).json({ success: true, message: "Payment has been verified" })
//         }
//         else {
//             res.status(400).json({ success: false, message: "Payment verification failed" })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.status(error.status).send(error.message);
//     }
// }

const getPaymentLink = async (req, res) => {
    try {
        const { amount, currency, description, customer } = req.body;

        const razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        // fuction to generate unix timestamp which is 30 minutes past the current time
        function getUnixTime() {
            const date = new Date();
            const unixTime = Math.floor(date.getTime() / 1000) + 1800;
            return unixTime;
        }

        // function to generate random reference id which is unique every time
        function generateReferenceId() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = ' ';
            const charactersLength = characters.length;
            for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const order = {
            amount: amount * 100,   // amount in smallest currency unit
            currency: currency,
            accept_partial: false,
            description: description,
            customer: customer,
            expire_by: getUnixTime(),   // 30 minutes past the current time
            reference_id: generateReferenceId(),    // need to be unique every time
            notify: {
                sms: true,
                email: true,
                whatsapp: true
            },
            reminder_enable: true,
            options: {
                checkout: {
                    theme: {
                        hide_topbar: true
                    }
                }
            },
            // callback_method: "get",
            // callback_url: "http://localhost:3001/payment/paymentSuccess",
        }

        const razorpayResponse = await razorpayInstance.paymentLink.create(order);
        res.status(200).json(razorpayResponse)
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
}

/* /payment/paymentSuccess?
razorpay_payment_id=pay_NqcxXRevNRGkbs
&
razorpay_payment_link_id=plink_NqcvmPuDrYWqXd
&
razorpay_payment_link_reference_id=+df5xSJzW
&
razorpay_payment_link_status=paid
&
razorpay_signature=9cceaabd27068e36dfa31c63f62d2caa7866916ddfe7c7b5f5c858240f06cbd1    */
// create a function to get the query parameters and console log them
// const paymentSuccess = (req, res) => {
//     try {
//         const {
//             razorpay_payment_id,
//             razorpay_payment_link_id,
//             razorpay_payment_link_reference_id,
//             razorpay_payment_link_status,
//             razorpay_signature
//         } = req.query;

//         console.log({
//             razorpay_payment_id,
//             razorpay_payment_link_id,
//             razorpay_payment_link_reference_id,
//             razorpay_payment_link_status,
//             razorpay_signature
//         });

//         // res.send({ message: "Payment Success" });


//         /* Verification */
//         const keySecret = key_secret;

//         // const validation = validatePaymentVerification({
//         //     "payment_link_id": razorpay_payment_link_id,
//         //     "payment_id": razorpay_payment_id,
//         //     "payment_link_reference_id": razorpay_payment_link_reference_id,
//         //     "payment_link_status": razorpay_payment_link_status,
//         // }, razorpay_signature, keySecret);
//         // console.log(validation);
//         // res.send(validation);
//         let hmac = crypto.createHmac('sha256', keySecret);
//         hmac.update(razorpay_payment_link_id + "|" + razorpay_payment_id + "|" + razorpay_payment_link_reference_id + "|" + razorpay_payment_link_status);
//         const generated_signature = hmac.digest('hex');
//         if (razorpay_signature === generated_signature) {
//             res.send({ success: true, message: "Payment has been verified", generated_signature, razorpay_signature })
//         }
//         else {
//             res.send({ success: false, message: "Payment verification failed", generated_signature, razorpay_signature })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         res.status(error.status).send(error.message);
//     }
// }

const verification = (req, res) => {
    const SECRET = webhook_secret    // webhook secret
    console.log(req.body.payload)

    const razorpay_signature = req.headers['x-razorpay-signature']
    
    // const crypto = require('crypto')

    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(JSON.stringify(req.body));
    const generated_signature = hmac.digest('hex');

    if (razorpay_signature === generated_signature) {
        console.log({ success: true, message: "Payment has been verified", generated_signature, razorpay_signature })
        // do more to store the payment details in the database
    }
    else {
        console.log({ success: false, message: "Payment verification failed", generated_signature, razorpay_signature })
    }

    res.json({ status: "ok" })
}

module.exports = {
    // createOrder,
    // verifyOrder,
    getPaymentLink,
    // paymentSuccess,
    verification
};

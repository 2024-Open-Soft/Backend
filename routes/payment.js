const router = require("express").Router();

const { header, body, query } = require("express-validator");
const { validate } = require("../utils/validator");
const { isLoggedIn } = require("../middlewares");

const { getPaymentLink, verification } = require("../controllers/payment");


// // ROUTE 1: creating an order using: POST "/payment/createOrder"
// router.post('/createOrder',
//     [
//         body("amount", "amount is requied").exists(),
//         body("currency", "currency is requied").exists()
//     ],
//     validate,
//     // isLoggedIn,
//     createOrder
// );

// // ROUTE 2: verifying an order using: POST "/payment/verifyOrder"
// router.post('/verifyOrder',
//     [
//         body("order_id", "order_id is requied").exists(),
//         body("payment_id", "payment_id is requied").exists(),
//         header("x-razorpay-signature", "razorpay_signature is required").exists()
//     ],
//     validate,
//     // isLoggedIn,
//     verifyOrder
// );

// ROUTE 3: getPaymentLink using: POST "/payment/getPaymentLink"
router.post('/getPaymentLink',
    [
        body("amount", "amount is requied").exists(),
        body("currency", "currency is requied").exists(),
        // body("description", "description is requied").exists(),
        body("customer", "customer is requied").exists(),
    ],
    validate,
    // isLoggedIn,
    getPaymentLink
)
/* /payment/paymentSuccess?razorpay_payment_id=pay_NqcxXRevNRGkbs&razorpay_payment_link_id=plink_NqcvmPuDrYWqXd&razorpay_payment_link_reference_id=+df5xSJzW&razorpay_payment_link_status=paid&razorpay_signature=9cceaabd27068e36dfa31c63f62d2caa7866916ddfe7c7b5f5c858240f06cbd1    */
// // ROUTE 4: paymentSuccess using: POST "/payment/paymentSuccess"
// // router.get('/paymentSuccess?razorpay_payment_id=:razorpay_payment_id&razorpay_payment_link_id=:razorpay_payment_link_id&razorpay_payment_link_reference_id=:razorpay_payment_link_reference_id&razorpay_payment_link_status=:razorpay_payment_link_status&razorpay_signature=:razorpay_signature',
// router.get('/paymentSuccess',
//     [
//         // query("razorpay_payment_id", "razorpay_payment_id is requied").exists(),
//         // body("razorpay_signature", "razorpay_signature is requied").exists(),
//     ],
//     // validate,
//     // isLoggedIn,
//     paymentSuccess
// )

// const crypto = require('crypto')

// router.post('/test', (req, res) => {
//     const razorpay_payment_id = 'pay_NqfKMWGfzbUql4'
//     const razorpay_payment_link_id = 'plink_NqfJfduA5Z0Jrj'
//     const razorpay_payment_link_reference_id = ' XaC0wKdc'
//     const razorpay_payment_link_status = 'paid'
//     const razorpay_signature = '79981a63446d90b70e20c6aadc22f9e5d47ab8aac78d8e2c1d3406024fda6dfa'
//     // d7203cee0ffb171f70e0e0280e15125500c4faee59d24bdf76275f01fe24c295
//     // 5ee5c14cbc81edef1a6b35970d44b916a78ae868d3dd1059e6d6a5855edaf36e
//     let hmac = crypto.createHmac('sha256', process.env.key_secret);
//     hmac.update(
//         razorpay_payment_id
//         + "|" + 
//         razorpay_payment_link_id 
//     );
//     const generated_signature = hmac.digest('hex');

//     res.send({ razorpay_signature, generated_signature })
// })

// need to update the webhook url in the razorpay dashboard
// {domain}/payment/verification
router.post('/verification', verification)

module.exports = router;
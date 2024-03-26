const router = require("express").Router();

const { header, body, query } = require("express-validator");
const { validate } = require("../utils/validator");
const { isLoggedIn } = require("../middlewares");

const { getPaymentLink, verification } = require("../controllers/payment");


// ROUTE 1: getPaymentLink using: POST "/payment/getPaymentLink"
router.post('/getPaymentLink',
    [
        body("planID", "planID is requied").exists(),
        body("duration", "duration is requied").exists(),
        // body("description", "description is requied").exists(),
        body("startDate", "startDate is requied").exists(),
    ],
    validate,
    isLoggedIn,
    getPaymentLink
)


// need to update the webhook url in the razorpay dashboard: {domain}/payment/verification
// ROUTE 2: verification using: POST "/payment/verification"
router.post('/verification',
    isLoggedIn,
    verification
)

module.exports = router;
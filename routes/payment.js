const router = require("express").Router();

const { header, body, query } = require("express-validator");
const { validate } = require("../utils/validator");
const { isLoggedIn } = require("../middlewares");

const { getPaymentLink, verification } = require("../controllers/payment");


// ROUTE 1: getPaymentLink using: POST "/payment/getPaymentLink"
router.post('/link',
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


// ROUTE 2: verification using: POST "/payment/verification"
// need to update the webhook url in the razorpay dashboard: {domain}/payment/verification
// not to add any other validators in this webhook route
router.post('/verification',
    verification
)

module.exports = router;

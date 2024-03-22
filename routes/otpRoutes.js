const router = require("express").Router();

const { generateOtp, verifyOtp } = require("../controllers/otpController");



const { body, header, oneOf, validationResult, withMessage } = require("express-validator");
const message = require("../utils/message");

// Middleware function to validate email or phoneNumber
const validateEmailOrPhoneNumber = [
  // Check if email or phoneNumber is provided
  oneOf([
    body("phoneNumber",).exists().isMobilePhone(),
    [
      body("email").exists().isEmail(),
      header("Authorization").exists()
    ]
  ], { message: "Email with Authentication or phoneNumber is required" }),
  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post("/generate", validateEmailOrPhoneNumber, generateOtp);
router.post("/verify", [
  body("otp", "OTP is required").exists().isNumeric(),
  header("Authorization", "Authorization token is required").exists()
], (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, verifyOtp);

module.exports = router;


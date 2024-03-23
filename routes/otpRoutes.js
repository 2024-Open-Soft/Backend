const router = require("express").Router();

const { generateOtp, verifyOtp, resetPassword} = require("../controllers/otpController");



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

router.post('/reset_password', [
  body("password", "Password is required").exists().isLength({ min: 8 }),
],(req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, resetPassword)

module.exports = router;


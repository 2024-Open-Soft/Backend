const router = require("express").Router();
const { body, header, oneOf, validationResult } = require("express-validator");

const { generateOtp, verifyOtp } = require("../controllers/otp");
const { validate } = require("../utils/validator");

router.post(
  "/generate",
  oneOf(
    [
      body("phoneNumber").exists().isMobilePhone(),
      [body("email").exists().isEmail(), header("Authorization").exists()],
    ],
    { message: "Email with Authentication or phoneNumber is required" },
  ),
  validate,
  generateOtp,
);

router.post(
  "/verify",
  [
    body("otp", "OTP is required").exists().isNumeric(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  verifyOtp,
);

module.exports = router;

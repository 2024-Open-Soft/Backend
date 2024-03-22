const router = require("express").Router();

const { generateOtp, verifyOtp } = require("../controllers/otpController");



const { body, validationResult } = require('express-validator');

// Middleware function to validate email or phoneNumber
const validateEmailOrPhoneNumber = [
  // Check if email or phoneNumber is provided
  body('credential').optional().isEmail().normalizeEmail(),
  body('credential').optional().isLength(13).withMessage('Invalid phone number'),

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


// Middleware function to validate email or phoneNumber based on type
// const validateCredential = [
//   // Check if type is provided and valid
//   body('type').notEmpty().isIn(['email', 'phoneNumber']).withMessage('Invalid type'),

//   // Dynamically validate credential based on type
//   (req, res, next) => {
//     const { type, credential } = req.body;

//     // Validate credential based on type
//     let validationRule;
//     if (type === 'email') {
//       validationRule = body('credential').isEmail().normalizeEmail();
//     } else if (type === 'phoneNumber') {
//       validationRule = body('credential').isMobilePhone().withMessage('Invalid phone number');
//     }

//     // Check for validation errors
//     validationRule(req, res, () => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     });
//   }
// ];


router.post("/generate", validateEmailOrPhoneNumber, generateOtp);
router.post("/verify", verifyOtp);

module.exports = router;


const { check, validationResult, oneOf } = require('express-validator');

const validateLogin = [
    check('password').notEmpty().withMessage('Password is required'),
    oneOf([
        check('email').isEmail(),
        check('phoneNumber').isMobilePhone()
    ], 'Email or phone number is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    validateLogin
}
const { check, oneOf } = require('express-validator');

const validateLogin = [
    check('password').notEmpty().withMessage('Password is required'),
    oneOf([
        check('email').isEmail(),
        check('phoneNumber').isMobilePhone()
    ], 'Email or phone number is required')
];


module.exports = {
    validateLogin
}
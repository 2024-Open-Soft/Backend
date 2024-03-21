const register = require('../controllers/reg');
const router = require('express').Router();
const { check } = require('express-validator');


router.post('/register',  // Register user endpoint
    [check('name', 'Name length should be 10 to 20 characters')
        .isLength({ min: 10, max: 20 }),
    check('password', 'Password length should be 8 to 10 characters')
        .isLength({ min: 8, max: 10 }),
    check('token', 'Token is required').exists()], register
);


module.exports = router;
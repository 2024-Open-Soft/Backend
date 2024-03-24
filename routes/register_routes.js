const register = require('../controllers/register');
const router = require('express').Router();
const { check, header } = require('express-validator');


router.post('/register',  // Register user endpoint
    [check('name', 'Name length should be 10 to 20 characters')
        .isString(),
    check('password', 'Password length should be atleast 8 characters')
        .isLength({ min: 8 }),
    header('Authorization', 'Token is required').exists(),
    ], register
);


module.exports = router;
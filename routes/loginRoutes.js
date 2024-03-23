const router = require('express').Router();

const { loginUser } = require('../controllers/login');
const { validateLogin } = require('../middlewares/validateLogin');

router.post('/login', validateLogin, loginUser);

module.exports = router;



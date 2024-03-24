const router = require('express').Router();

const { isLoggedIn } = require('../middleware');

const { getProfile, updateProfile } = require('../controllers/userController');

router.get('/profile', isLoggedIn, getProfile);

router.put('/profile', isLoggedIn, updateProfile);


module.exports = router;
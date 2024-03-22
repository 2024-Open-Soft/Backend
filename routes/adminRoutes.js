const router = require('express').Router();

const { isLoggedIn, isAdmin } = require('../middleware');
const { getAllUsers, getUser } = require('../controllers/adminController');


router.get("/user", isLoggedIn, isAdmin, getAllUsers);
router.get("/user/:id", isLoggedIn, isAdmin, getUser);

router.get("/movie/:id", isLoggedIn, isAdmin, getMovie);
router.get("/movie", isLoggedIn, isAdmin, getAllMovies);
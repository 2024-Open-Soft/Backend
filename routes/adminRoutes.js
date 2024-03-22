const router = require('express').Router();

const { isLoggedIn, isAdmin } = require('../middleware');
const { getAllUsers, getUser } = require('../controllers/adminUserController');
const { getMovie, getAllMovies } = require('../controllers/adminMovieController');


router.get("/user", isLoggedIn, isAdmin, getAllUsers);
router.get("/user/:id", isLoggedIn, isAdmin, getUser);

router.get("/movie/:id", isLoggedIn, isAdmin, getMovie);
router.get("/movie", isLoggedIn, isAdmin, getAllMovies);

module.exports = router;
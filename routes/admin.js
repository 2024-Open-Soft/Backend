const router = require("express").Router();
const { body } = require("express-validator");

const { isLoggedIn, isAdmin } = require("../middlewares");
const { getAllUsers, getUser } = require("../controllers/admin-user");
const {
  getMovie,
  getAllMovies,
  uploadmovie,
  updateMovie
} = require("../controllers/admin-movie");
const { deleteComment } = require("../controllers/admin-comment");
const { validate } = require("../utils/validator");
const { createSubscriptionPlan } = require("../controllers/admin-plan");

router.get("/user", isLoggedIn, isAdmin, getAllUsers);
router.get("/user/:id", isLoggedIn, isAdmin, getUser);

router.get("/movie/:id", isLoggedIn, isAdmin, getMovie);
router.get("/movie", isLoggedIn, isAdmin, getAllMovies);

router.delete(
  "/movie/comments",
  body("commentId").exists().withMessage("Comment ID is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteComment,
);

router.post(
  "/uploadmovie",
  body('title').exists().withMessage('Movie is required'),
  body('plot').exists().withMessage('countries is required'),
  body('genres').exists().withMessage('Title is required'),
  body('runtime').exists().withMessage('Description is required'),
  body('cast').exists().withMessage('Rating is required'),
  body('languages').exists().withMessage('Release Date is required'),
  body('released').exists().withMessage('Genre is required'),
  body('directors').exists().withMessage('Cast is required'),
  body('rated').exists().withMessage('Crew is required'),
  validate,
  isLoggedIn,
  isAdmin,
  uploadmovie
)


router.patch(
  "/movie/:id",
  validate,
  isLoggedIn,
  isAdmin,
  updateMovie
)


router.post(
  "/plan",
  isLoggedIn, isAdmin,
  createSubscriptionPlan
)

module.exports = router;


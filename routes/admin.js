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
  body('title').exists().withMessage('Field is required'),
  body('plot').exists().withMessage('Field is required'),
  body('genres').exists().withMessage('Field is required'),
  body('runtime').exists().withMessage('Field is required'),
  body('cast').exists().withMessage('Field is required'),
  body('languages').exists().withMessage('Field is required'),
  body('released').exists().withMessage('Field is required'),
  body('directors').exists().withMessage('Field is required'),
  body('rated').exists().withMessage('Field is required'),
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


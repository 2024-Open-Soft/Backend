const router = require("express").Router();
const { body } = require("express-validator");

const { isLoggedIn, isAdmin } = require("../middlewares");
const { getAllUsers, getUser } = require("../controllers/adminUserController");
const {
  getMovie,
  getAllMovies,
} = require("../controllers/movieController");

const { deleteComment } = require("../controllers/adminCommentController");
const { validate } = require("../utils/validator");

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

module.exports = router;


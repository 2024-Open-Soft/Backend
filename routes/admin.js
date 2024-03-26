const router = require("express").Router();
const multer = require("multer")()
const { body } = require("express-validator");

const { isLoggedIn, isAdmin } = require("../middlewares");
const { getAllUsers, getUser } = require("../controllers/adminUserController");
const {
  getMovie,
  getAllMovies,
} = require("../controllers/adminMovieController");
const { videoUpload } = require("../controllers/adminUpload")
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

// Add express validator for the video upload route
router.post("/upload", multer.single("file"), videoUpload);
module.exports = router;


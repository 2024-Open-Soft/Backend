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
  body("title").exists().withMessage("Title is required"),
  body("description").exists().withMessage("Description is required"),
  body("rating").exists().withMessage("Rating is required"),
  body("genre").exists().withMessage("Genre is required"),
  body("language").exists().withMessage("Language is required"),
  body("duration").exists().withMessage("Duration is required"),
  body("cast").exists().withMessage("Cast is required"),
  body("director").exists().withMessage("Director is required"),
  body("releaseDate").exists().withMessage("Release date is required"),
  body("image").exists().withMessage("Image is required"),
  body("trailer").exists().withMessage("Trailer is required"),
  body("video").exists().withMessage("Video is required"),
  body("status").exists().withMessage("Status is required"),
  body("createdAt").exists().withMessage("Created at is required"),
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


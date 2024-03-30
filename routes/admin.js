const router = require("express").Router();
const { body, header, oneOf } = require("express-validator");
const multer = require("multer");

const {
  createSubscriptionPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/admin-plan");

const { isLoggedIn, isAdmin } = require("../middlewares");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin-user");
const {
  getMovie,
  getAllMovies,
  uploadMovie,
  updateMovie,
  uploadMovieFile,
  uploadTrailer,
  uploadPoster,
  deleteMovie,
  deleteTrailer,
  deleteMovieVideo,
  deletePoster,
} = require("../controllers/admin-movie");
const { deleteComment } = require("../controllers/admin-comment");
const { validate } = require("../utils/validator");

router.get(
  "/user",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  getAllUsers
);
router.get(
  "/user/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  getUser
);

router.post(
  "/user",
  body("email").exists().isEmail().withMessage("Email is required"),
  body("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password is required"),
  body("name").exists().withMessage("Name is required"),
  body("phoneNumber")
    .exists()
    .isMobilePhone()
    .withMessage("Phone number is required"),
  body("countryCode").exists().withMessage("Country code is required"),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  createUser
);

router.put(
  "/user/:id",
  oneOf([
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("name"),
    body("phoneNumber").isMobilePhone(),
    body("countryCode"),
  ]),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  updateUser
);

router.delete(
  "/user/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteUser
);

router.get(
  "/movie/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  getMovie
);

router.get(
  "/movie",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  getAllMovies
);

router.delete(
  "/movie/comments",
  body("commentId").exists().withMessage("Comment ID is required"),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteComment
);

router.post("/plan", isLoggedIn, isAdmin, createSubscriptionPlan);

router.put("/plan/:id", isLoggedIn, isAdmin, updatePlan);

router.delete("/plan/:id", isLoggedIn, isAdmin, deletePlan);

router.post(
  "/movie/upload",
  body("title").exists().withMessage("Field is required"),
  body("plot").exists().withMessage("Field is required"),
  body("genres").exists().withMessage("Field is required"),
  body("runtime").exists().withMessage("Field is required"),
  body("cast").exists().withMessage("Field is required"),
  body("languages").exists().withMessage("Field is required"),
  body("released").exists().withMessage("Field is required"),
  body("directors").exists().withMessage("Field is required"),
  body("rated").exists().withMessage("Field is required"),
  validate,
  isLoggedIn,
  isAdmin,
  uploadMovie
);

router.put(
  "/movie/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  updateMovie
);

router.post(
  "/movie/:movieId/upload",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadMovieFile
);

router.delete(
  "/movie/:movieId/movie/delete",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteMovie
);

router.delete(
  "/movie/:movieId/video/delete",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteMovieVideo
);

router.post(
  "/movie/:movieId/trailer/upload",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadTrailer
);

router.delete(
  "/movie/:movieId/trailer/delete",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteTrailer
);

router.post(
  "/movie/:movieId/poster/upload",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadPoster
);

router.delete(
  "/movie/:movieId/poster/delete",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deletePoster
);

module.exports = router;

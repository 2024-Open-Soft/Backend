const router = require("express").Router();
const { body } = require("express-validator");
const multer = require("multer");

const { isLoggedIn, isAdmin } = require("../middlewares");
const { getAllUsers, getUser } = require("../controllers/admin-user");
const {
  getMovie,
  getAllMovies,
  uploadMovie,
  uploadTrailer,
  deleteMovie,
  deleteTrailer,
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

router.post("/plan", isLoggedIn, isAdmin, createSubscriptionPlan);

router.post(
  "/movie/:movieId/upload",
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadMovie,
);

router.post("/movie/:movieId/delete", isLoggedIn, isAdmin, deleteMovie);

router.post(
  "/movie/:movieId/trailer/upload",
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadTrailer,
);

router.post(
  "/movie/:movieId/trailer/delete",
  isLoggedIn,
  isAdmin,
  deleteTrailer,
);

router.post(
  "/movie/:movieId/poster/upload",
  isLoggedIn,
  isAdmin,
  multer().single("file"),
  uploadTrailer,
);

router.post(
  "/movie/:movieId/poster/delete",
  isLoggedIn,
  isAdmin,
  body("movieId").exists().withMessage("Movie ID is required"),
  validate,
  deleteTrailer,
);

module.exports = router;

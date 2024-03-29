const router = require("express").Router();
const { body, header, oneOf } = require("express-validator");
const multer = require("multer");

const { updatePlan } = require("../controllers/admin-plan");

const { isLoggedIn, isAdmin } = require("../middlewares");
<<<<<<< HEAD
const { getAllUsers, getUser, createUser } = require("../controllers/admin-user");
=======
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/admin-user");
>>>>>>> 17425c4379726f5e79af16c009cf8b67f95382f1
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

<<<<<<< HEAD
router.get("/user", isLoggedIn, isAdmin, getAllUsers);
router.get("/user/:id", isLoggedIn, isAdmin, getUser);
router.post(
  "/user",
  [
    body("name").exists().withMessage("Name is required"),
    body("email").exists().withMessage("Email is required"),
    body("countryCode").exists().withMessage("Country code is required"),
    body("phoneNumber").exists().withMessage("Phone number is required"),
    body("password").exists().withMessage("Password is required"),
  ],
  validate,
  isLoggedIn,
  isAdmin,
  createUser
);
=======
router.get("/user", 
  header("Authorization").exists().withMessage("Token is required"),
  validate,
isLoggedIn, isAdmin, getAllUsers);
router.get("/user/:id", 
  header("Authorization").exists().withMessage("Token is required"),
  validate,
isLoggedIn, isAdmin, getUser);
>>>>>>> 17425c4379726f5e79af16c009cf8b67f95382f1

router.post("/user",
  body("email").exists().isEmail().withMessage("Email is required"),
  body("password").exists().isLength({ min: 8 }).withMessage("Password is required"),
  body("name").exists().withMessage("Name is required"),
  body("phoneNumber").exists().isMobilePhone().withMessage("Phone number is required"),
  body("countryCode").exists().withMessage("Country code is required"),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn, isAdmin, createUser);

router.put("/user/:id",
  oneOf([
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("name"),
    body("phoneNumber").isMobilePhone(),
    body("countryCode"),
  ]),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn, isAdmin, updateUser);

router.delete("/user/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn, isAdmin, deleteUser);

router.get("/movie/:id",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn, isAdmin, getMovie);

router.get("/movie",
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn, isAdmin, getAllMovies);

router.delete(
  "/movie/comments",
  body("commentId").exists().withMessage("Comment ID is required"),
  header("Authorization").exists().withMessage("Token is required"),
  validate,
  isLoggedIn,
  isAdmin,
  deleteComment,
);

router.post("/plan", isLoggedIn, isAdmin, createSubscriptionPlan);

router.put("/plan/:id",isLoggedIn, isAdmin, updatePlan);

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

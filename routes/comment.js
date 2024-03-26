const router = require("express").Router();

const {
  createComment,
  getComments,
  deleteComment,
  editComment,
} = require("../controllers/comment");
const { isLoggedIn } = require("../middlewares");
const { body } = require("express-validator");
const { validate } = require("../utils/validator");

router.get("/:movieId", getComments);

router.post(
  "/",
  [
    body("movieId", "Movie Id required").exists(),
    body("comment", "Comment required").exists(),
  ],
  validate,

  isLoggedIn,
  createComment
);

router.delete(
  "/",
  body("commentId", "Comment Id required").exists(),
  validate,
  isLoggedIn,
  deleteComment
);

router.put(
  "/",
  [
    body("commentId", "Comment Id required").exists(),
    body("comment", "Comment required").exists(),
  ],
  validate,
  isLoggedIn,
  editComment
);

module.exports = router;

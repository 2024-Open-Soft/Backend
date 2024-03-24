const router = require("express").Router();
const { body, header } = require("express-validator");

const { isLoggedIn } = require("../middlewares");
const {
  updateHistoryController,
  deleteHistoryController,
} = require("../controllers/movieHistoryController");
const {
  updateWatchlistController,
  deleteWatchlistController,
} = require("../controllers/movieWatchlistController");
const { validate } = require("../utils/validator");

router.post(
  "/history",
  [
    body("movieId", "Movie Id required").exists(),
    body("timestamp", "Timestamp required")
      .optional()
      .isLength({ min: 5, max: 8 }),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  isLoggedIn,
  updateHistoryController,
);

router.delete(
  "/history",
  [
    body("movieId", "Movie Id required").exists(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  isLoggedIn,
  deleteHistoryController,
);

router.post(
  "/watchlist",
  [
    body("movieId", "Movie Id required").exists(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  isLoggedIn,
  updateWatchlistController,
);

router.delete(
  "/watchlist",
  [
    body("movieId", "Movie Id required").exists(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  isLoggedIn,
  deleteWatchlistController,
);

module.exports = router;

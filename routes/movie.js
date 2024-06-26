const router = require("express").Router();
const { body, header } = require("express-validator");
const { isLoggedIn } = require("../middlewares");

const {
  updateHistoryController,
  deleteHistoryController,
} = require("../controllers/history");

const {
  updateWatchlistController,
  deleteWatchlistController,
} = require("../controllers/watchlist");

const { validate } = require("../utils/validator");

const {
  getMovies,
  getMovie,
  getLatestMovies,
  getUpcomingMovies,
  getMovieWatchLink,
  filterMovies,
  getFeaturedMovies
} = require("../controllers/movie");

router.post(
  "/history",
  [
    body("movieId", "Movie Id required").exists(),
    body("timestamp", "Timestamp required")
      .optional()
      .isNumeric(),
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

router.get("/", getMovies);

router.get("/latest", getLatestMovies);

router.get("/upcoming", getUpcomingMovies);

router.get("/filter", filterMovies);

router.get("/featured", getFeaturedMovies);

router.get("/:id", getMovie);

router.post(
  "/watch",
  [
    body("movieId", "Movie Id required").exists(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  isLoggedIn,
  getMovieWatchLink,
);

module.exports = router;

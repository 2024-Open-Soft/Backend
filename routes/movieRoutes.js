const router = require('express').Router();

const { isLoggedIn } = require('../middleware');
const { updateHistoryController, deleteHistoryController } = require('../controllers/movieHistoryController');
const { updateWatchlistController, deleteWatchlistController } = require('../controllers/movieWatchlistController');


router.post("/history", isLoggedIn, updateHistoryController);
router.delete("/history", isLoggedIn, deleteHistoryController);

router.post("/watchlist", isLoggedIn, updateWatchlistController);
router.delete("/watchlist", isLoggedIn, deleteWatchlistController);
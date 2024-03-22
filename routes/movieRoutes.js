const router = require('express').Router();

const { isLoggedIn } = require('../middleware');
const { updateHistoryController, deleteHistoryController } = require('../controllers/movieController');


router.post("/history", isLoggedIn, updateHistoryController);
router.delete("/history", isLoggedIn, deleteHistoryController);
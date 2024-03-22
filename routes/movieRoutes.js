const router = require('express').Router();

const { isLoggedIn } = require('../middleware');
const { updateHistoryController, } = require('../controllers/movieController');

router.post("/history", isLoggedIn, updateHistoryController);
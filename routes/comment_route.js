const comment = require('../controllers/comment');
const router = require('express').Router();
const { check } = require('express-validator');
router.post('/comments',  // Register user endpoint
    [check('movieId', 'MovieId is required').exists(),
    check('userId', 'UserId is required').exists(),
    check('comment', 'Comment is required').exists()], comment
);


module.exports = router;
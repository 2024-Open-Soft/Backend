const router = require('express').Router();

const { createComment, getComments, deleteComment, editComment } = require('../controllers/commentController');
const { isLoggedIn } = require('../middleware');
const { body, validationResult } = require('express-validator');

router.get('/comments/:movieId', getComments);

router.post('/comments', [
    body('movieId', 'Movie Id required').exists(),
    body('comment', 'Comment required').exists(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, isLoggedIn, createComment);

router.delete('/comments', [
    body('commentId', 'Comment Id required').exists(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, isLoggedIn, deleteComment);

router.put('/comments', [
    body('commentId', 'Comment Id required').exists(),
    body('comment', 'Comment required').exists(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, isLoggedIn, editComment);

module.exports = router;
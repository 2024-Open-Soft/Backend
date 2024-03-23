const router = require('express').Router();
const getComments = require('../controllers/comments')

router.get('/comments/:id',getComments);

module.exports = router;

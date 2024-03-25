const router = require('express').Router();

const { updateComment } = require('../controllers/updatecomments');

router.patch('/comments', updateComment);

module.exports = router;


const router = require('express').Router();
const semantic = require('../controllers/semantic.js');
const searchOnEnter= require('../controllers/search.js');
const autocomplete= require('../controllers/autocomplete.js');
router.get('/semantic', semantic);
router.get('/searchOnEnter',searchOnEnter);
router.get('/autocomplete',autocomplete);

module.exports = router;

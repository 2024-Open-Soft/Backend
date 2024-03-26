const router = require('express').Router();
// const auto = require('../controllers/autocomplete.js');
// const autocomplete = require('../controllers/autocomplete-exel.js');
// const semantic = require('../controllers/semantic.js');
// const searchEnter= require('../controllers/searchEnter.js');
// const seRegex= require('../controllers/se-regex.js');
// const seFuzzy= require('../controllers/se-fuzzy.js');
const searchOnEnter= require('../controllers/searchOnEnterController.js');
const autocomplete= require('../controllers/autocompleteController.js');
// router.post('/autocomplete', auto);
// router.post('/autocomplete-exel', autocomplete);
// router.post('/semantic', semantic);
// router.post('/searchEnter', searchEnter);
// router.post('/seRegex', seRegex);
// router.post('/seFuzzy',seFuzzy);
router.post('/searchOnEnter',searchOnEnter);
router.post("/autocomplete",autocomplete);

module.exports = router;

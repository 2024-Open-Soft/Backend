const router = require("express").Router();

const { plansFeature } = require('../controllers/plansController');

router.get('/feature', plansFeature);

module.exports = router;
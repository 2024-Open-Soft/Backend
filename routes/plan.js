const router = require("express").Router();

const { getSubscriptionPlans, getSubscriptionPlan } = require('../controllers/plan');

router.get('/', getSubscriptionPlans);
router.get('/:id', getSubscriptionPlan);

module.exports = router;
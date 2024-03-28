const router = require("express").Router();

const { getSubscriptionPlans, getSubscriptionPlan, getActiveSubscriptionPlan } = require('../controllers/plan');
const { isLoggedIn } = require('../middlewares');



router.get('/', getSubscriptionPlans);
router.get('/:id', getSubscriptionPlan);
router.get('/active/:id',isLoggedIn,getActiveSubscriptionPlan);




module.exports = router;
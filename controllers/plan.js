const { SubscriptionPlan } = require('../models');

const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        console.log(plans)
        return res.status(200).json(plans);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getSubscriptionPlan = async (req, res) => {
    try {
        const id = req.params.id;
        const plan = await SubscriptionPlan.findById(id);
        return res.status(200).json(plan);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { getSubscriptionPlans, getSubscriptionPlan };
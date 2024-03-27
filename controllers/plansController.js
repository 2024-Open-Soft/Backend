const SubscriptionFeature = require('../models/subscription-feature');

exports.plansFeature = async (req, res, next) => {
    try {
        const plans = await SubscriptionFeature.find();
        return res.status(200).json(plans);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
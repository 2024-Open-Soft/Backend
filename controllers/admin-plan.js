const { SubscriptionPlan } = require('../models');
const SubscriptionFeature = require('../models/subscription-feature');

const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, discountPercentage, features } = req.body;

        const plan = new SubscriptionPlan({
            name: name,
            price: price,
            discountPercentage: discountPercentage,
            features: features
        });

        await plan.save();

        return res.json({
            message: "Subscription Plan created successfully",
            data: {
                plan: plan.toObject(),
            },
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Error creating subscription plan" });
    }
};


const updateSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, discountPercentage, features } = req.body;

        // const plan = new SubscriptionPlan({
        //     name: name,
        //     price: price,
        //     discountPercentage: discountPercentage,
        // });

        // await plan.save();

        return res.json({
            message: "Subscription Plan updated successfully",
            data: {
                // plan: plan.toObject(),
            },
        });
    } catch (error) {
        return res.status(400).json({ error: "Error creating subscription plan" });
    }
};

module.exports = { createSubscriptionPlan, updateSubscriptionPlan }

const { SubscriptionPlan } = require("../models");
const SubscriptionFeature = require("../models/subscription-feature");

const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, discountPercentage, features } = req.body;

    const plan = new SubscriptionPlan({
      name: name,
      price: price,
      discountPercentage: discountPercentage,
      features: features,
    });

    await plan.save();

    return res.json({
      message: "Subscription Plan created successfully",
      data: {
        plan: plan.toObject(),
      },
    });
  } catch (error) {
    console.log(error);
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

const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);

    const {
      name = "",
      price = -1,
      discountPercentage = -1,
      maxResolution = -1,
      maxDevices = -1,
    } = req.body;

    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }

    if (name) {
      plan.name = name;
    }

    if (price >= 0) {
      plan.price = price;
    }

    if (discountPercentage >= 0) {
      plan.discountPercentage = discountPercentage;
    }

    if (maxResolution >= 0) {
      plan.features[0].value = `${maxResolution}`;
    }

    if (maxDevices >= 0) {
      plan.features[1].value = `${maxDevices}`;
    }

    await plan.save();
    return res.json({
      message: "Subscription Plan updated successfully",
      data: {
        plan: plan.toObject(),
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Error updating subscription plan" });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Subscription plan not found" });
    }

    return res.json({
      message: "Subscription Plan deleted successfully",
      data: {
        plan: plan.toObject(),
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Error deleting subscription plan" });
  }
};

module.exports = {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  updatePlan,
  deletePlan,
};

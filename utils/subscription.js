const { SubscriptionPlan } = require("../models");

const getActiveSubscriptionPlan = async (user) => {
  const data = user.toObject();
  let maxDevices = 1;

  for (const i of data.subscriptions) {
    const currentdate = new Date();
    const startDate = new Date(i.startDate);
    const duration = i.originalDuration;
    const createdAt = i.createdAt;

    const endDate = new Date(
      startDate.getTime() + duration * 30 * 24 * 60 * 60 * 1000,
    );

    console.log({ sub: i, currentdate, startDate, duration, createdAt });

    if (endDate >= currentdate && startDate <= currentdate) {
      const plan = await SubscriptionPlan.findById(i.plan);

      for (const i in plan.features) {
        if (plan.features[i].name === "max-devices") {
          maxDevices = parseInt(plan.features[i].value);
          break;
        }
      }
      return {
        activeSubscription: {
          ...plan.toObject(),
          status: "active",
          startDate,
          endDate,
          createdAt,
        },
        maxDevices: maxDevices,
      };
    }
  }
  return { activeSubscription: null, maxDevices: 1 };
};

module.exports = { getActiveSubscriptionPlan };


const { SubscriptionPlan } = require('../models');

const getActiveSubscriptionPlan = async (user) => {
    const data = user.toObject();
    let maxDevices = 1

    for (const i of data.subscriptions) {
        const currentdate = new Date();
        const startDate = new Date(i.startDate);
        const duration = i.orignalDuration;

        const endDate = new Date(startDate.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

        if (endDate >= currentdate && startDate <= currentdate && i.status === "captured") {
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
                    endDate
                },
                maxDevices: maxDevices
            };
        }
    }
    return { activeSubscription: null, maxDevices: 1 }
}

module.exports = { getActiveSubscriptionPlan }
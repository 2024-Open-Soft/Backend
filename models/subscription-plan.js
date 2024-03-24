const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}

const SubscriptionPlanSchema = new Schema(
  {
    name: String,
    price: Number,
    discountPercentage: Number,
    features: [ref("SubscriptionFeature")],
    discount: Number,
  },
  { timestamps: true },
);

const SubscriptionPlan = mongoose.model(
  "subscription_plan",
  SubscriptionPlanSchema,
);

module.exports = SubscriptionPlan;

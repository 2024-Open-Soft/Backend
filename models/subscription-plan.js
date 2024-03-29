const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}

const SubscriptionFeatureSchema = new Schema(
  {
    name: String,
    description: String,
    value: String,
  },
  { timestamps: true },
);

const SubscriptionPlanSchema = new Schema(
  {
    name: String,
    price: Number,
    discountPercentage: Number,
    features: [SubscriptionFeatureSchema],
    discount: Number,
  },
  { timestamps: true },
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
);

module.exports = SubscriptionPlan;

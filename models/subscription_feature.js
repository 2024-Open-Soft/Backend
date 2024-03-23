const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubscriptionFeatureSchema = new Schema(
  {
    name: String,
    description: String,
    value: String,
  },
  { timestamps: true },
);

const SubscriptionFeature = mongoose.model(
  "Subscription_Feature",
  SubscriptionFeatureSchema,
);

module.exports = SubscriptionFeature;

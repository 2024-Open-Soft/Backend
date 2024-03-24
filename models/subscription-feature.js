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

const SubscriptionFeatures = mongoose.model(
  "subscription_feature",
  SubscriptionFeatureSchema,
);

module.exports = SubscriptionFeatures;

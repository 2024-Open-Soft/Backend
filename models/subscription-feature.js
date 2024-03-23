const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubscriptionFeaturesSchema = new Schema(
  {
    name: String,
    description: String,
    value: String,
  },
  { timestamps: true },
);

const SubscriptionFeatures = mongoose.model(
  "subscription_features",
  SubscriptionFeaturesSchema,
);

module.exports = SubscriptionFeatures;

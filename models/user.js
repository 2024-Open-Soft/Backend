const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}
// nested collection
const SubscriptionSchema = new Schema({
  plan: ref("SubscriptionPlan"),
  paymentId: String,
  status: {
    type: String,
    enum: ["TO_BE_PAID", "ACTIVE", "ON_HOLD", "EXPIRED", "PAYMENT_ERROR"],
    default: "TO_BE_PAID",
  },
  startDate: Date,
  orignalDuration: Number,
  durationLeft: Number,
});

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: {
      type: new Schema({
        countryCode: String,
        phoneNumber: String,
      }),
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
    genres: [String],
    languages: [String],
    history: [
      new Schema({
        movie: ref("Movie"),
        timeStamp: { type: String, default: "00:00:00" },
      }),
    ],
    watchLater: [ref("Movie")],
    comments: [ref("Comment")],
    transactions: [String],
    subscriptions: [SubscriptionSchema],
  },
  { timestamps: true },
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
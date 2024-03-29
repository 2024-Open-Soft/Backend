const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}

const PaymentSchema = new Schema({
  referenceId: String,
  paylinkId: String,
  orderId: String,
  paymentId: String,
  razorpay_signature: String,
  status: {
    type: String,
    enum: ["TO_BE_PAID", "PAID", "ON_HOLD", "EXPIRED", "PAYMENT_ERROR"],
    default: "TO_BE_PAID",
  },
  amount: Number,
  discountPercentage: Number,
  plan: ref("SubscriptionPlan"),
},
  { timestamps: true }
);

// nested collection
const SubscriptionSchema = new Schema({
  plan: ref("SubscriptionPlan"),
  payment: PaymentSchema,
  startDate: Date,
  orignalDuration: Number,
  durationLeft: Number,
},
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    countryCode: {
      type: String,
      default: "+91",
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
    payments: [PaymentSchema],
    subscriptions: [SubscriptionSchema],
    tokens: [{ type: String, default: [] }],
    ips: { type: [String], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

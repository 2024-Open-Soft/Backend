const crypto = require("crypto");
const { SubscriptionPlan, User } = require("../models");
const { generatePaymentLink } = require("../utils/payment");

const getPaymentLink = async (req, res) => {
  try {
    const {
      planID, // based on which plan is selected
      duration, // in months
    } = req.body;

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(
      startDate.getTime() + duration * 30 * 24 * 60 * 60 * 1000,
    );

    if (endDate < new Date()) {
      return res.status(400).json({ error: "Invalid start date" });
    }

    const subscriptions = [...req.user.subscriptions];

    for (let i in subscriptions) {
      const subscription = subscriptions[i].toObject();
      const expiryDate = new Date(subscription.startDate);
      expiryDate.setMonth(
        expiryDate.getMonth() + subscription.originalDuration,
      );

      if (
        (endDate >= subscription.startDate && endDate <= expiryDate) ||
        (startDate >= subscription.startDate && startDate <= expiryDate)
      ) {
        return res.status(400).json({
          error: "You already have a subscription in the given period",
        });
      }
    }

    // extraction of plan details from the database
    const plan = await SubscriptionPlan.findById(planID);
    const amount =
      parseInt(plan.price) *
      parseInt(duration) *
      (1 - parseInt(plan.discountPercentage) / 100);

    // generate a unique reference id
    const referenceId = crypto.randomBytes(16).toString("hex");

    // get the user details and generate the payment link
    const { name, email, phone } = req.user;
    const { id, short_url } = await generatePaymentLink(
      referenceId,
      amount,
      "INR",
      { name, contact: phone, email },
      planID,
      startDate,
      duration,
      req.user,
    );

    // storing the payment link details in the database
    req.user.payments.push({
      plan: plan,
      referenceId: referenceId,
      paylinkId: id,
      discountPercentage: plan.discountPercentage,
    });
    await User.findByIdAndUpdate(req.user._id, { payments: req.user.payments });

    return res
      .status(200)
      .json({ message: "Payment link generated", link: short_url });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const verification = async (req, res) => {
  try {
    const webhook_secret = process.env.RZ_WEBHOOK_SECRET;
    const razorpay_signature = req.headers["x-razorpay-signature"];

    // generate HMAC from the request payload and the secret
    const hmac = crypto.createHmac("sha256", webhook_secret);
    hmac.update(JSON.stringify(req.body));
    const generated_signature = hmac.digest("hex");

    const signatureIsValid = generated_signature === razorpay_signature;

    if (signatureIsValid) {
      // storing the payment details in the database
      const { referenceId, userID, planID, startDate, originalDuration } =
        req.body.payload.payment.entity.notes;
      const { status, id, order_id } = req.body.payload.payment.entity;

      const user = await User.findOne({ _id: userID });

      const payments = user.payments.map((p) =>
        p.referenceId === referenceId
          ? {
            ...p,
            status: status === "captured" ? "PAID" : "PAYMENT_ERROR",
            paymentId: id,
            orderId: order_id,
            razorpay_signature: razorpay_signature,
          }
          : p,
      );

      const subscription = {
        plan: planID,
        startDate,
        originalDuration,
        payment: payments.filter((p) => p.referenceId === referenceId)[0],
      };

      await User.findByIdAndUpdate(userID, {
        payments,
        $push: { subscriptions: subscription },
      });
    } else {
      // console.log({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    // console.log(error);
    // res.status(error.status).send(error.message);
  }

  res.json({ status: "ok" }); // need to send this response to the webhook or else razorpay will block the webhook
};

module.exports = {
  getPaymentLink,
  verification,
};

const Razorpay = require('razorpay')
const crypto = require('crypto')
const { SubscriptionPlan, User } = require('../models')
const { generatePaymentLink } = require('../utils/payment')

const key_id = process.env.key_id
const key_secret = process.env.key_secret
const webhook_secret = process.env.webhook_secret

const getPaymentLink = async (req, res) => {
    try {
        const {
            // amount, 
            // currency, 
            // description, 
            // customer, 
            planID, // based on which plan is selected
            duration, // in months
            startDate
        } = req.body;

        // extraction of plan details from the database
        const plan = await SubscriptionPlan.findById(planID);
        const amount = parseInt(plan.price) * parseInt(duration);

        // generate a unique reference id
        const referenceId = crypto.randomBytes(16).toString('hex');

        const { name, email, phone } = req.user // user ka email nahi mila
        const { id, short_url } = await generatePaymentLink(referenceId, amount, "INR", { name, contact: phone, email }, planID, req.user);
        /////////////// console.log(id, short_url)

        req.user.subscriptions.push({ plan: plan, referenceId: referenceId, paylinkId: id, startDate: startDate, orignalDuration: duration });
        /////////////// console.log(req.user.subscriptions)

        await User.findByIdAndUpdate(req.user._id, { subscriptions: req.user.subscriptions });

        return res.status(200).json({ message: "Payment link generated", link: short_url });
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
}


const verification = async (req, res) => {
    const SECRET = webhook_secret    // webhook secret
    ////////////// console.log(req.body.payload)

    const razorpay_signature = req.headers['x-razorpay-signature']

    // const crypto = require('crypto')

    const hmac = await crypto.createHmac('sha256', SECRET);
    hmac.update(JSON.stringify(req.body));
    const generated_signature = hmac.digest('hex');

    if (razorpay_signature === generated_signature) {
        console.log({ success: true, message: "Payment has been verified", generated_signature, razorpay_signature })
        // do more to store the payment details in the database
        const user_id = req.body.payload.payment.entity.notes.userID
        ///////////// console.log(req.body.payload.payment.entity, req.body.payload.payment.entity.notes, req.body.payload.payment.entity.notes.planID)

        const user = await User.findOne({ _id: user_id })
        const subID = user.subscriptions.findIndex(sub => sub.referenceId === req.body.payload.payment.entity.notes.referenceId)

        const subscriptions = [...user.subscriptions]
        /////////// console.log(subscriptions, subID, subscriptions[subID])

        //////////////////////////console.log("req.body.payload.payment")
        //////////////////////////console.log(req.body.payload.payment)

        subscriptions[subID].status = req.body.payload.payment.entity.status
        subscriptions[subID].paymentId = req.body.payload.payment.entity.id
        subscriptions[subID].orderId = req.body.payload.payment.entity.order_id
        subscriptions[subID].razorpay_signature = razorpay_signature

        //////////////////////////console.log("user.subscriptions[subID]")
        //////////////////////////console.log(user.subscriptions[subID])

        //////////////////////////console.log({
        //////////////////////////    status: req.body.payload.payment.status,
        //////////////////////////    paymentId: req.body.payload.payment.entity.id,
        //////////////////////////    orderId: req.body.payload.payment.entity.order_id,
        //////////////////////////    razorpay_signature: razorpay_signature
        //////////////////////////})

        //////////////////////////console.log("subscriptions[subID]")
        //////////////////////////console.log(subscriptions[subID])

        await User.findByIdAndUpdate(user_id, { subscriptions: subscriptions })
    }
    else {
        console.log({ success: false, message: "Payment verification failed", generated_signature, razorpay_signature })
    }

    res.json({ status: "ok" })
}

module.exports = {
    // createOrder,
    // verifyOrder,
    getPaymentLink,
    // paymentSuccess,
    verification
};

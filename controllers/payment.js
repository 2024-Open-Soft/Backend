const crypto = require('crypto')
const { SubscriptionPlan, User } = require('../models')
const { generatePaymentLink } = require('../utils/payment')

const webhook_secret = process.env.webhook_secret


const getPaymentLink = async (req, res) => {
    try {
        const {
            planID, // based on which plan is selected
            duration, // in months
            startDate
        } = req.body;

        // extraction of plan details from the database
        const plan = await SubscriptionPlan.findById(planID);
        const amount = parseInt(plan.price) * parseInt(duration);

        // generate a unique reference id
        const referenceId = crypto.randomBytes(16).toString('hex');

        // get the user details and generate the payment link
        const { name, email, phone } = req.user;
        const { id, short_url } = await generatePaymentLink(referenceId, amount, "INR", { name, contact: phone, email }, planID, req.user);

        // storing the payment link details in the database
        req.user.subscriptions.push({ plan: plan, referenceId: referenceId, paylinkId: id, startDate: startDate, orignalDuration: duration });
        await User.findByIdAndUpdate(req.user._id, { subscriptions: req.user.subscriptions });

        return res.status(200).json({ message: "Payment link generated", link: short_url });
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
}


const verification = async (req, res) => {
    try {
        const SECRET = webhook_secret    // webhook secret
        const razorpay_signature = req.headers['x-razorpay-signature'];

        // generate HMAC from the request payload and the secret
        const hmac = await crypto.createHmac('sha256', SECRET);
        hmac.update(JSON.stringify(req.body));
        const generated_signature = hmac.digest('hex');

        const signatureIsValid = (generated_signature === razorpay_signature);

        console.log({ signatureIsValid });

        if (signatureIsValid) {
            console.log({ success: true, message: "Payment has been verified" })

            // storing the payment details in the database
            const user_id = req.body.payload.payment.entity.notes.userID
            const user = await User.findOne({ _id: user_id })

            const subID = user.subscriptions.findIndex(sub => sub.referenceId === req.body.payload.payment.entity.notes.referenceId)
            const subscriptions = [...user.subscriptions]

            subscriptions[subID].status = req.body.payload.payment.entity.status
            subscriptions[subID].paymentId = req.body.payload.payment.entity.id
            subscriptions[subID].orderId = req.body.payload.payment.entity.order_id
            subscriptions[subID].razorpay_signature = razorpay_signature

            await User.findByIdAndUpdate(user_id, { subscriptions: subscriptions })
        }
        else {
            console.log({ success: false, message: "Payment verification failed" })
        }
    }
    catch (error) {
        console.log(error);
        // res.status(error.status).send(error.message);
    }

    res.json({ status: "ok" })  // need to send this response to the webhook or else razorpay will block the webhook
}

module.exports = {
    getPaymentLink,
    verification
};

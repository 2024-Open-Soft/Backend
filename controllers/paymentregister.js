const model = require("../models/user");
const User = model.User;

const paymentregister = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const user = req.user;
        if (!(await User.findById(user))) {
            return res.status(404).json({ message: "User not found" });
        }

        const paymentcreate = User.subscriptions.findByIdAndUpdate(
            orderId = subscriptionId,
            razorpay_signature = "to be updated",
            paymentId = "to be updated",
        );
        return res.status(200).json({
            message: "Subscription created successfully",
            data: {
                paymentcreate,
            },
        });
    } catch (error) {
        return res.status(400).json({ error: "Error creating subscription" });
    }
};

module.exports = { paymentregister };
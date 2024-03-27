const { User } = require("../models");
const { generateJWT, parseToken } = require("../utils/token");
const sendingMail = require("../utils/mailer");

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const token = generateJWT({ purpose: "reset-password", userId: user._id });

        sendingMail({
            from: "no-reply@example.com",
            to: email,
            subject: "Reset Password",
            text: `Click here to reset your password: http://${process.env.BASE_URL}/reset/${token}`,
        });
        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { userId } = parseToken(req);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { forgotPassword, resetPassword };
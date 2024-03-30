const { User } = require("../models");
const { generateJWT, parseToken } = require("../utils/token");
const sendingMail = require("../utils/mailer");

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
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
        return res.status(500).json({ error: "Internal server error" });
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
        return res.status(500).json({ error: "Internal server error" });
    }
}

const validToken = async (req, res) => {
    try {
        const { userId } = parseToken(req);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User not found", valid: false });
        }

        return res.status(200).json({ message: "Valid token", valid: true});
    } catch (error) {
        console.log(error);
        // if the error is due to token expired or invalid token then send Token expired message
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Token expired", valid: false});
        }
        return res.status(500).json({ error: "Internal server error", valid: false});
    }
}

module.exports = { forgotPassword, resetPassword, validToken };
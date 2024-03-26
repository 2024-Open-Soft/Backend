const bcrypt = require("bcryptjs");

const message = require("../utils/message");
const sendingMail = require("../utils/mailer");
const { generateJWT, parseToken } = require("../utils/token");
const { User } = require("../models");

const generateOtp = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    let new_token = null

    let otp = Math.floor(100000 + Math.random() * 900000);

    if (phoneNumber) {
      message({
        to: phoneNumber,
        body: `Your OTP is ${otp}`,
      });
      const salt = await bcrypt.genSalt(10);
      otp = await bcrypt.hash(`${otp}`, salt);
      new_token = generateJWT({ otp, phoneNumber });
    } else {
      const token = parseToken(req);
      const userId = token.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "Mobile number not verified" });
      }
      sendingMail({
        from: "no-reply@example.com",
        to: email,
        subject: "OTP",
        text: `Your OTP is ${otp}`,
      });
      const salt = await bcrypt.genSalt(10);
      otp = await bcrypt.hash(`${otp}`, salt);
      new_token = generateJWT({ otp, email, phoneNumber: user.phone, userId });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      data: {
        token: new_token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const otp = parseInt(req.body.otp);
    const { phoneNumber, email, userId, otp: tokenOtp } = parseToken(req);

    console.log(phoneNumber, email, userId, otp, tokenOtp)

    const isMatch = await bcrypt.compare(`${otp}`, tokenOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({
      phone: phoneNumber,
    });

    if (phoneNumber) {
      if (user && user.password) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (!user) {
        user = await User.create({
          phone: phoneNumber,
        });
      }
    } else {
      if (!user) {
        return res.status(400).json({ message: "Invalid user" });
      }

      user = await User.updateOne(
        { id: userId },
        {
          email: email,
        },
      );
    }

    const token = generateJWT({ userId: user._id });

    return res.status(200).json({
      message: "OTP verified successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};

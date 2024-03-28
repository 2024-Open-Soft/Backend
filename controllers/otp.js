const bcrypt = require("bcryptjs");

const message = require("../utils/message");
const sendingMail = require("../utils/mailer");
const { generateJWT, parseToken } = require("../utils/token");
const { User } = require("../models");
const { type } = require("os");

const generateOtp = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body; // Get the email and phone number from the request body

    const payload = {};


    let otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

    if (phoneNumber) {
      message({
        to: phoneNumber,
        body: `Your OTP is ${otp}`,
      });
      payload.phoneNumber = phoneNumber; // Store the phone number in the payload
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
      payload.email = email; // Store the email in the payload
      payload.userId = userId;
    }
    const salt = await bcrypt.genSalt(10);
    otp = await bcrypt.hash(`${otp}`, salt);
    payload.otp = otp;
    const token = generateJWT(payload);
    return res.status(200).json({
      message: "OTP sent successfully",
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const otp = parseInt(req.body.otp);
    const { phoneNumber, email, otp: tokenOtp, userId } = parseToken(req);

    const payload = {}

    const isMatch = await bcrypt.compare(`${otp}`, tokenOtp);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    let user = await User.findOne({
      phone: phoneNumber,
    });

    if (phoneNumber) {
      if (user && user.password) {
        return res.status(400).json({ error: "User already exists" });
      }

      if (!user) {
        user = await User.create({
          phone: phoneNumber,
        });
        payload.userId = user._id;
      }
    } else {

      user = await User.findOne({
        _id: userId,
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid user" });
      }

      user = await User.updateOne(
        { _id: userId },
        {
          email: email,
        },
      );
      payload.userId = userId;
    }

    const token = generateJWT(payload);

    return res.status(200).json({
      message: "OTP verified successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
  generateOtp,
  verifyOtp,
};

const message = require("../utils/message");
const sendingMail = require("../utils/mailer");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const { generateJWT, parseToken } = require("../utils/token");

const generateOtpPhoneNumber = async (req) => {
  let otp = Math.floor(100000 + Math.random() * 900000);
  let phone = req.body.phoneNumber;
  console.log(phone);
  message({
    to: phone,
    body: `Your OTP is ${otp}`,
  });
  console.log({ otp });
  const salt = await bcrypt.genSalt(10);
  otp = await bcrypt.hash(`${otp}`, salt);
  const token = generateJWT({ otp, phoneNumber: phone });
  console.log("Controller", token);
  return token;
};

const generateOtpEmail = async (req) => {
  let otp = Math.floor(100000 + Math.random() * 900000);
  const email = req.body.email;
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

  const newToken = generateJWT({ otp, userId, email });
  return newToken;
};

const generateOtp = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (phoneNumber) {
      const token = await generateOtpPhoneNumber(req, res);
      console.log("Generated OTP", token);
      return res.status(200).json({
        message: "OTP sent successfully",
        data: {
          token: token,
        },
      });
    } else {
      const token = await generateOtpEmail(req, res);
      return res.status(200).json({
        message: "OTP sent successfully",
        data: {
          token: token,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtpEmail = async (req) => {
  const otp = parseInt(req.body.otp);
  const token = parseToken(req);
  const userId = token.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }

  const isMatch = await bcrypt.compare(`${otp}`, token.otp);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const updatedUser = await User.updateOne(
    { id: userId },
    {
      email: token.email,
    },
  );

  const newToken = generateJWT({ userId });
  return newToken;
};

const verifyOtpPhoneNumber = async (req) => {
  const otp = parseInt(req.body.otp);
  const token = parseToken(req);

  const isMatch = await bcrypt.compare(`${otp}`, token.otp);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const findUser = await User.findOne({
    phone: token.phoneNumber,
  });
  if (findUser) {
    if (findUser.password) {
      return { msg: "User already exists" };
    }
    const deletedUser = await User.deleteOne({
      id: findUser.id,
    });
  }
  const user = await User.create({
    phone: token.phoneNumber,
  });

  const newToken = generateJWT({ userId: user.id });
  return { token: newToken };
};

const verifyOtp = async (req, res) => {
  try {
    const token = parseToken(req);
    if (token.phoneNumber) {
      const { token, msg } = await verifyOtpPhoneNumber(req, res);
      if (msg) {
        return res.status(400).json({ message: msg });
      }
      return res.status(200).json({
        message: "OTP verified successfully",
        data: {
          token: token,
        },
      });
    } else {
      const token = await verifyOtpEmail(req, res);
      return res.status(200).json({
        message: "OTP verified successfully",
        data: {
          token: token,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};

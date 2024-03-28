const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const { generateJWT, getActiveTokens } = require("../utils/token");
const jwtExpiryTime = 36000;

const User = require("../models/user");
const { Movie, Comment, SubscriptionPlan } = require("../models");
const { createUserObject } = require("../utils/user");
const { getActiveSubscriptionPlan } = require("../utils/subscription");

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, password } = req.body;

    console.log(phoneNumber, password);

    const user = await User.findOne({
      phone: phoneNumber,
    });

    if (!user) {
      return res.status(401).send({ error: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const { activeSubscription, maxDevices } = await getActiveSubscriptionPlan(user);

    let tokens = getActiveTokens(user.tokens)

    if (tokens.length >= maxDevices) {
      return res.status(401).send({ error: "Maximum number of devices reached" });
    }

    const token = generateJWT({ id: user._id }, jwtExpiryTime);
    tokens.push(token)
    
    await User.findByIdAndUpdate(user._id, { tokens: tokens })

    const data = await createUserObject(user);

    return res.json({
      message: "User logged in",
      data: {
        token,
        user: { ...data, activeSubscription }
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};


const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    const token = req.token;

    const newTokens = user.tokens.filter(t => t !== token);
    await User.findByIdAndUpdate(user._id, { tokens: newTokens });

    return res.status(200).json({ message: "User logged out" });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
}

module.exports = {
  loginUser, logoutUser
};

const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const { generateJWT } = require("../utils/token");
const jwtExpiryTime = 36000;

const User = require("../models/user");

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phoneNumber, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }

    const data = user.toObject();
    const token = generateJWT({ id: data._id }, jwtExpiryTime);
    delete data.password;

    return res.json({
      message: "User logged in",
      data: {
        token,
        user: data,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  loginUser,
};

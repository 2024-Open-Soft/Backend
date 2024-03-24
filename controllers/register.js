const bcrypt = require("bcryptjs");
const { parseToken } = require("../utils/token");
const { validationResult } = require("express-validator");
const jwtExpiryTime = 36000; // JWT expiry time in seconds

const { generateJWT } = require("../utils/token");

const { User } = require("../models");

const register = async (req, res) => {
  // Register user controller
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, password } = req.body; // Get name, password and token from request body

    const decoded = parseToken(req); // Get user id from token

    // Check if user already exists
    const existingUser = await User.findById(decoded.userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        password: hashedPassword,
      },
      { new: true },
    ); // Update user name and password in database

      // remove password from usr
    const user = updatedUser.toObject();
    delete user.password;

    const newToken = generateJWT({ id: user._id }, jwtExpiryTime); // Generate new token or user id

    res.json({
      message: "User updated",
      data: { token: newToken, user },
    }); // Return token and user data

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = register;

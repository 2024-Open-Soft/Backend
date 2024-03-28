const bcrypt = require("bcryptjs");

const { parseToken } = require("../utils/token");
const { generateJWT } = require("../utils/token");
const { User } = require("../models");

const jwtExpiryTime = 36000;

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const decoded = parseToken(req);

    if (!(await User.findById(decoded.userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        password: hashedPassword,
      },
      { new: true }
    );

    const user = updatedUser.toObject();
    delete user.password;

    const token = generateJWT({ id: user._id }, jwtExpiryTime);

    res.json({
      message: "User updated",
      data: { token, user },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = register;

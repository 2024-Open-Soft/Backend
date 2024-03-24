const bcrypt = require('bcryptjs');
const { generateJWT } = require('../utils/token');
const jwtExpiryTime = 36000; // JWT expiry time in seconds

const User = require("../models/user");

const loginUser = async (req, res) => {
    try {
        const { email = '', phoneNumber = '', password } = req.body;
        
        const user = await User.findOne({
            $or: [
                { phone: phoneNumber },
                { email: email },
            ]
        });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

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

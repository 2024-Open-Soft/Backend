const { User, Movie, Comment, SubscriptionPlan } = require("../models");

const bcrypt = require("bcryptjs");
const { createUserObject } = require("../utils/user");
const { getActiveSubscriptionPlan } = require("../utils/subscription");

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const data = await createUserObject(user);
    const { activeSubscription, maxDevices } =
      await getActiveSubscriptionPlan(user);

    return res.json({
      message: "User Details Fetched",
      data: { ...data, activeSubscription: activeSubscription },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    let user = req.user;

    const { name, password, genre, languages } = req.body;

    if (!password) {
      user = await User.findOneAndUpdate(user._id, {
        name: name || user.name,
        genre,
        languages,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.findOneAndUpdate(user._id, {
        name: name || user.name,
        password: hashedPassword,
        genre,
        languages,
      });
    }

    user = user.toObject();
    delete user.password;

    return res.status(200).json({
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error updating profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

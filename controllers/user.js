const { User } = require("../models");

const getProfile = async (req, res) => {
  try {
    let user = req.user;
    return res.status(200).json({
      message: "Profile fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    let user = req.user;

    const { name, genre, languages } = req.body;
    user = await User.findOneAndUpdate(user._id, {
      name,
      genre,
      languages,
    });

    user = user.toObject();
    delete user.password;

    return res.status(200).json({
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Error updating profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};


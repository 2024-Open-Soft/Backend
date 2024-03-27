const { User, Movie, Comment } = require("../models");

const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    let user = req.user;

    const watchLater = [], history = [], comments = [];

    for (let i in user.watchLater) {
      console.log(i)
      // user.watchLater[i] = await Movie.findById(user.watchLater[i]);
      watchLater[i] = await Movie.findById(user.watchLater[i]);
    }

    for (let i in user.history) {
      history[i] = { movie: user.history[i].movie, timeStamp: user.history[i].timeStamp };
      history[i].movie = await Movie.findById(user.history[i].movie);
    }

    for (let i in user.comments) {
      comments[i] = await Comment.findById(user.comments[i]);
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: {
        user: {
          ...user.toObject(),
          watchLater,
          history,
          comments,
        }
      },
    });
  } catch (error) {
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
    }
    else {
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
    return res.status(400).json({ error: "Error updating profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};


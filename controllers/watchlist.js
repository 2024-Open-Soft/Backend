const { User } = require("../models");

const updateWatchlistController = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = req.user;

    if (!user.watchLater)
      user.watchLater = [];

    if (user.watchLater.includes(movieId))
      return res.status(400).json({ error: "already exists in watchlist" });

    await User.findByIdAndUpdate(user._id, {
      $push: { watchLater: movieId },
    });

    return res.status(200).json({ message: "Watchlist updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteWatchlistController = async (req, res) => {
  try {
    const { movieId } = req.body;

    const user = req.user;

    if (!user.watchLater.includes(movieId))
      return res.status(400).json({ error: "Does not exist in watchlist" });

    await User.findByIdAndUpdate(user._id, {
      $pull: { watchLater: movieId },
    });

    return res.status(200).json({ message: "Watchlist updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  updateWatchlistController,
  deleteWatchlistController,
};

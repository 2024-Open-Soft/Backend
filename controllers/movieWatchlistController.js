const prisma = require("../prisma/index");

const updateWatchlistController = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = req.user;

    if (user.watchLaterIds.includes(movieId))
      return res.status(400).json({ message: "already exists in watchlist" });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        watchLaterIds: {
          push: movieId,
        },
      },
    });
    return res.status(200).json({ message: "Watchlist updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteWatchlistController = async (req, res) => {
  try {
    const { movieId } = req.body;

    const user = req.user;

    if (!user.watchLaterIds.includes(movieId))
      return res.status(400).json({ message: "does not exist in watchlist" });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        watchLaterIds: user.watchLaterIds.filter((mId) => mId != movieId),
      },
    });

    return res.status(200).json({ message: "Watchlist updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateWatchlistController,
  deleteWatchlistController,
};


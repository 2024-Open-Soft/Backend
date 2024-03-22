const prisma = require("../prisma/index");

const updateWatchlistController = async (req, res) => {
    try {
        const { movieId } = req.body;

        const user = req.user;

        // find movieId in user.watchlist
        const watchlist = user.watchlist.find((movie) => movie.movie_id === movieId);

        // add that movie to the watchlist
        if (!watchlist) {
            user.watchlist.push({ movieId });
        }

        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: user.userId
            },
            data: {
                watchlist: user.watchlist
            }
        });

        return res.status(200).json({ message: "Watchlist updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteWatchlistController = async (req, res) => {
    try {
        const { movieId } = req.body;

        const user = req.user;

        // find movieId in user.watchlist
        const watchlist = user.watchlist.find((movie) => movie.movie_id === movieId);

        // remove that movie from the watchlist
        if (watchlist) {
            user.watchlist = user.watchlist.filter((movie) => movie.movie_id !== movieId);
        }

        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: user.userId
            },
            data: {
                watchlist: user.watchlist
            }
        });

        return res.status(200).json({ message: "Watchlist updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    updateWatchlistController,
    deleteWatchlistController
}
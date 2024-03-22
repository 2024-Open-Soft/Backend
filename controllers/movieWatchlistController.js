const { parseToken } = require("../utils/token");
const prisma = require("../prisma/index");

const updateWatchlistController = async (req, res) => {
    try {
        const token = parseToken(req);
        const userId = token.userId;

        const { movieId } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // find movieId in user.watchlist
        const watchlist = user.watchlist.find((movie) => movie.movieId === movieId);

        // add that movie to the watchlist
        if (!watchlist) {
            user.watchlist.push({ movieId });
        }

        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: userId
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
        const token = parseToken(req);
        const userId = token.userId;

        const { movieId } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // find movieId in user.watchlist
        const watchlist = user.watchlist.find((movie) => movie.movieId === movieId);

        // remove that movie from the watchlist
        if (watchlist) {
            user.watchlist = user.watchlist.filter((movie) => movie.movieId !== movieId);
        }

        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: userId
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
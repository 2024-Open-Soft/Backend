const prisma = require("../prisma/index");

const updateWatchlistController = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = req.user;

        // find movieId in user.watchlist
        if(!user.watchLater)
            user.watchLater = []
        const watchlist = user.watchLater.find((movie) => movie.movieId === movieId);
        // add that movie to the watchlist
        if (!watchlist) {
            user.watchLater.push({ movieId, userId: user.id });
        }
        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: user.id
            },
            data :{
                watchLater: {
                    create: [{
                        movieId: movieId,
                        userId: user.id
                    }]}
                }
            
        })
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
        if(!user.watchLater)
            user.watchLater = []
        const watchlist = user.watchLater.find((movie) => movie.movie_id === movieId);

        // remove that movie from the watchlist
        if (watchlist) {
            user.watchLater = user.watchLater.filter((movie) => movie.movie_id !== movieId);
        }

        // update the user's watchlist
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                watchLater: user.watchLater
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
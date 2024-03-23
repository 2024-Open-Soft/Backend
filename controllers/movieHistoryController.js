const { User } = require("../models");

const updateHistoryController = async (req, res) => {
    try {
        const { movieId, timestamp } = req.body;
        if(!timestamp)
            timestamp = "00:00:00";

        const user = req.user;

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movie_id === movieId);

        // remove that movie from that position and add it to the beginning
        if (history) {
            user.history = user.history.filter((movie) => movie.movie_id !== movieId);
        }

        user.history.unshift({ movieId, timestamp });

        // update the user's history
        await User.findByIdAndUpdate(user.id, { history: user.history })

        return res.status(200).json({ message: "History updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteHistoryController = async (req, res) => {
    try {
        const { movieId } = req.body;

        const user = req.user;

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movie_id === movieId);

        // remove that movie from that position
        if (history) {
            user.history = user.history.filter((movie) => movie.movie_id !== movieId);
        }

        // update the user's history
        await User.findByIdAndUpdate(user.id, { history: user.history })

        return res.status(200).json({ message: "History updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    updateHistoryController,
    deleteHistoryController
}
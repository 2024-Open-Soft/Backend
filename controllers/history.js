const { User } = require("../models");

const updateHistoryController = async (req, res) => {
    try {
        const { movieId, timeStamp="00:00:00" } = req.body;
        
        let user = req.user;
        if(!user.history)
            user.history = [];

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movie.toString() === movieId);

        // remove that movie from that position and add it to the beginning
        if (history) {
            user.history = user.history.filter((movie) => movie.movie.toString() !== movieId);
        }

        console.log(timeStamp)

        user.history.unshift({ movie: movieId, timeStamp: timeStamp });

        // update the user's history
        await User.findByIdAndUpdate(user._id, { history: user.history })

        return res.status(200).json({ message: "History updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteHistoryController = async (req, res) => {
    try {
        const { movieId } = req.body;

        const user = req.user;

        if(!user.history)
            user.history = [];

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movie.toString() === movieId);

        // remove that movie from that position
        if (history) {
            user.history = user.history.filter((movie) => movie.movie.toString() !== movieId);
        }

        // update the user's history
        await User.findByIdAndUpdate(user._id, { history: user.history })

        return res.status(200).json({ message: "History updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    updateHistoryController,
    deleteHistoryController
}
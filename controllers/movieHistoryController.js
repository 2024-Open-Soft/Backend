const prisma = require("../prisma/index");
const bcrypt = require("bcryptjs");
const { parseToken } = require("../utils/token");

const updateHistoryController = async (req, res) => {
    try {
        const token = parseToken(req);
        const userId = token.userId;

        const { movieId, timestamp } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movieId === movieId);

        // remove that movie from that position and add it to the beginning
        if (history) {
            user.history = user.history.filter((movie) => movie.movieId !== movieId);
        }

        user.history.unshift({ movieId, timestamp });

        // update the user's history
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                history: user.history
            }
        });

        return res.status(200).json({ message: "History updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteHistoryController = async (req, res) => {
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

        // find movieId in user.history
        const history = user.history.find((movie) => movie.movieId === movieId);

        // remove that movie from that position
        if (history) {
            user.history = user.history.filter((movie) => movie.movieId !== movieId);
        }

        // update the user's history
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                history: user.history
            }
        });

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
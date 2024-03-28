const { parseToken } = require("../utils/token");
const { User } = require("../models");

const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        // paginatedResponse, take page number from query params and return 10 users per page

        const users = await User.find().skip((page - 1) * 10).limit(10);

        // remove password
        users.forEach((user) => {
            delete user.password;
        });

        return res.status(200).json({
            data: {
                users
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // remove password
        delete user.password;

        return res.status(200).json({
            data: {
                user
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    getUser
}
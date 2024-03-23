const { parseToken } = require("../utils/token");
const prisma = require("../prisma/index");


const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        // paginatedResponse, take page number from query params and return 10 users per page

        const users = await prisma.user.findMany({
            skip: (page - 1) * 10,
            take: 10
        });

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
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    getUser
}
const prisma = require('../prisma/index');

const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        // paginatedResponse, take page number from query params and return 10 users per page

        // select everything except user password, paymentToken, watchHistory, watchList and comments
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                phone: true,
                email: true,
                genres: true,
                languages: true,
                createdAt: true,
                updatedAt: true
            },
            skip: (page - 1) * 10,
            take: 10
        });

        return res.status(200).json({ users });
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
            },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                phone: true,
                email: true,
                genres: true,
                languages: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
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
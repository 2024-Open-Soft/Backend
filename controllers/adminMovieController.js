const prisma = require('../prisma/index');

const getAllMovies = async (req, res) => {
    try {
        // paginatedResponse, take page number from query params and return 10 movies per page
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const movies = await prisma.embedded_movies.findMany({
            skip: (page - 1) * 10,
            take: 10
        });

        return res.status(200).json({ movies });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await prisma.embedded_movies.findUnique({
            where: {
                id: parseInt(id)
            },
            select: requiredProperties
        });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        return res.status(200).json({ movie });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllMovies,
    getMovie
};
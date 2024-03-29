const { Movie } = require('../models');

const getAllMovies = async (req, res) => {
    try {
        // paginatedResponse, take page number from query params and return 10 movies per page
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const movies = await Movie.find().skip((page - 1) * 10).limit(10);

        return res.status(200).json({
            data: {
                movies
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        return res.status(200).json({
            data: {
                movie
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const uploadmovie = async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        return res.status(200).json({
            data: {
                movie
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(404).json({ error: "Movie not found" });
        }
        const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            data: {
                movie
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllMovies,
    getMovie,
    uploadmovie,
    updateMovie
};
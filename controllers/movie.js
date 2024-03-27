const { Movie } = require('../models');

const getMovies = async (req, res) => {
    try {
        // paginatedResponse, take page number from query params and return 10 movies per page
        const page = req.query.page ? parseInt(req.query.page) : 1;

        let movies = await Movie.find().skip((page - 1) * 10).limit(10);

        // remove movieUrl from each movie object
        movies = movies.map(movie => {
            const { movieUrl, ...rest } = movie.toObject();
            return rest;
        });

        return res.status(200).json({
            data: {
                movies
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        let movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // remove movieUrl from movie object
        const { movieUrl, ...rest } = movie.toObject();

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

module.exports = {
    getMovies,
    getMovieById
};
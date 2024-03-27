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

const getMovie = async (req, res) => {
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

const getLatestMovies = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 50;

    if (page < 1) return res.status(400).json({ message: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({ released: { $lte: new Date() } }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (page > totalPage) return res.status(400).json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $lte: new Date() } })
            .sort({ released: -1 })
            .skip(skip)
            .limit(perPage)
        // .select("title released");
        return res.status(200).json({ message: "Latest movies fetched", data: movies });
    }
    catch (error) {
        return res.status(500).json({ message: "Interval server error" });
    }
}

const getUpcomingMovies = async (req, res) => {
    const page = req.query.page;
    const perPage = 50;

    if (page < 1) return res.status(400).json({ message: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({ released: { $gt: new Date() } }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (totalPage !==0 && page > totalPage) return res.status(400).json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $gt: new Date() } })
            .sort({ released: 1 })
            .skip(skip)
            .limit(perPage)
        // .select("title released");

        return res.status(200).json({ message: "Upcoming movies fetched", data: movies });
    }
    catch (error) {
        return res.status(500).json({ message: "Interval server error" });
    }
}

module.exports = {
    getMovies,
    getMovie,
    getLatestMovies,
    getUpcomingMovies
};
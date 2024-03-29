const { User, Movie, Comment } = require("../models");
const aws = require("../utils/aws");
const { getActiveSubscriptionPlan } = require("../utils/subscription");

const getMovies = async (req, res) => {
    try {
        // paginated Response, take page number from query params and return 50 movies per page
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : 50;

        const skip = (page - 1) * perPage;

        let movies = await Movie.find()
            .skip(skip)
            .limit(perPage);

        // remove movie's video url from each movie object
        movies = movies.map((movie) => {
            const { movieUrl, summary_embedding, ...rest } = movie.toObject();
            return rest;
        });

        return res.status(200).json({
            data: {
                movies,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getMovie = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);

        let movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        let comments = await Comment.find({ movie: movie._id });

        if (!comments) {
            comments = [];
        }

        comments = await Promise.all(
            comments.map(async (comment) => {
                let user = await User.findById(comment.user);
                user = user?.toObject();
                user = { name: user?.name, email: user?.email, user_id: user?._id };

                return {
                    ...comment.toObject(),
                    user,
                };
            }),
        );

        // remove movie's url from movie object
        const { movieUrl, summary_embedding, ...rest } = movie.toObject();

        return res.status(200).json({
            data: {
                movie: rest,
                comments,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getLatestMovies = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 50;

    if (page < 1)
        return res
            .status(400)
            .json({ message: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({
            released: { $lte: new Date() },
        }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (totalPage !== 0 && page > totalPage)
            return res
                .status(400)
                .json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $lte: new Date() } })
            .sort({ released: -1 })
            .skip(skip)
            .limit(perPage);
        // .select("title released");
        return res
            .status(200)
            .json({ message: "Latest movies fetched", data: movies });
    } catch (error) {
        return res.status(500).json({ error: "Interval server error" });
    }
};

const getUpcomingMovies = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 50;

    if (page < 1)
        return res.status(400).json({ error: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({
            released: { $gt: new Date() },
        }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (totalPage !== 0 && page > totalPage)
            return res
                .status(400)
                .json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $gt: new Date() } })
            .sort({ released: 1 })
            .skip(skip)
            .limit(perPage);
        // .select("title released");
        

        return res
            .status(200)
            .json({ message: "Upcoming movies fetched", data: movies });
    } catch (error) {
        return res.status(500).json({ error: "Interval server error" });
    }
};

const getfeaturedMovie = async (req, res) => {
    try {
        const featuredMovies = await Movie.find({ isfeatured: true });
        return res.status(200).json({ data: featuredMovies });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Interval server error" });
    }
};

async function getMovieWatchLink(req, res) {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.json({ error: "not a valid movieId" });

    const { activeSubscription } = await getActiveSubscriptionPlan(req.user);

    const maxRes = parseInt(
        activeSubscription.features.filter(
            ({ name }) => name === "max-resolution",
        )[0].value,
    );

    let urls = [360, 720, 1080]
        .filter((res) => res <= maxRes)
        .map((res) => aws.getCloudfrontUrl(`movies/${movie._id}/original-${res}.m3u8`));
    return res.json({ urls });
}

const filterMovies = async (req, res) => {
    const { genres, languages, rating } = req.query;

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 50;
    let query = {};
    if (rating)
        query = {
            "imdb.rating": { $gt: parseFloat(rating), $lte: parseFloat(rating) + 1 },
        };
    if (genres)
        query.genres = {
            $elemMatch: { $in: genres.split(",") },
        };
    if (languages)
        query.languages = {
            $elemMatch: { $in: languages.split(",") },
        };

    try {
        const totalResults = await Movie.find(query).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (page > totalPage && totalPage !== 0)
            return res
                .status(400)
                .json({ message: "Invalid page requested", data: {} });
        const movies = await Movie.find(query)
            .sort({ released: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res
            .status(200)
            .json({ message: "Filtered movies fetched", data: movies, totalPage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getMovies,
    getMovie,
    getLatestMovies,
    getUpcomingMovies,
    getfeaturedMovie,
    filterMovies,
    getMovieWatchLink,
};

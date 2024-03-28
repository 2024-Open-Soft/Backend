const { User, Movie, Comment } = require("../models");
const aws = require("../utils/aws");
const { getActiveSubscriptionPlan } = require("../utils/subscription");

const getMovies = async (req, res) => {
  try {
    // paginatedResponse, take page number from query params and return 10 movies per page
    const page = req.query.page ? parseInt(req.query.page) : 1;

    let movies = await Movie.find()
      .skip((page - 1) * 10)
      .limit(10);

    // remove movieUrl from each movie object
    movies = movies.map((movie) => {
      const { movieUrl, ...rest } = movie.toObject();
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

    // remove movieUrl from movie object
    const { movieUrl, ...rest } = movie.toObject();

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
  const perPage = 50;

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

    if (page > totalPage)
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
  const page = req.query.page;
  const perPage = 50;

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
    // console.log(answer);
    return res.status(200).json(featuredMovies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Interval server error" });
  }
};

function getMovieWatchLink(req, res) {
  const movie = Movie.findById(req.body.movieId);
  if (!movie) return res.json({ error: "not a valid movieId" });

  const { activeSubscription } = getActiveSubscriptionPlan(req.user);

  if (
    parseInt(
      activeSubscription.features.filter(
        ({ name }) => name === "max-resolution",
      )[0].value,
    ) <= req.body.resolution
  )
    return res
      .status(401)
      .json({ error: "your subscription does not support this resolution" });

  let url = aws.getCloudfrontUrl(
    `transcoded/${movie._id}-${req.body.resolution}.m3u8`,
  );
  return res.json({ url });
}

module.exports = {
  getMovies,
  getMovie,
  getLatestMovies,
  getUpcomingMovies,
  getfeaturedMovie,
  getMovieWatchLink,
};

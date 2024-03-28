const { Movie } = require("../models");
const aws = require("../utils/aws");

const getAllMovies = async (req, res) => {
  try {
    // paginatedResponse, take page number from query params and return 10 movies per page
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const movies = await Movie.find()
      .skip((page - 1) * 10)
      .limit(10);

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

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({
      data: {
        movie,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function uploadMovie(req, res) {
  const file = req.file;
  const movie = Movie.findById(req.body.movieId);

  const s3res = aws.upload(file.buffer, `orignal/${movie._id}`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  const mediaConvertRes = aws.convertVideo(
    `orignal/${movie._id}`,
    [360, 720, 1080],
    "transcoded/",
  );
  if (mediaConvertRes.status != 200)
    return res.status(500).json({ error: "error converting video" });

  return res.send({ message: "success" });
}

async function uploadTrailer(req, res) {
  const file = req.file;
  const movie = Movie.findById(req.body.movieId);

  const s3res = aws.upload(file.buffer, `trailers/orignal/${movie._id}`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  const mediaConvertRes = aws.convertVideo(
    `trailers/${movie._id}`,
    [1080],
    "trailers/transcoded/",
  );
  if (mediaConvertRes.status != 200)
    return res.status(500).json({ error: "error converting video" });

  Movie.findByIdAndUpdate(movie._id, {
    trailerUrl: aws.getS3Url(`trailers/transcoded/${movie._id}.m3u8`),
  });

  return res.send({ message: "success" });
}

module.exports = {
  getAllMovies,
  getMovie,
  uploadMovie,
  uploadTrailer,
};

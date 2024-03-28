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

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  const s3res = await aws.upload(file.buffer, `movies/${movie._id}/orignal`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  const mediaConvertRes = await aws.convertVideo(
    `movies/${movie._id}/orignal`,
    [360, 720, 1080],
    `movies/${movie._id}/`,
  );
  if (mediaConvertRes.status != 200)
    return res.status(500).json({ error: "error converting video" });

  return res.json({ message: "success" });
}

async function uploadTrailer(req, res) {
  const file = req.file;
  const movie = Movie.findById(req.body.movieId);

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  const s3res = await aws.upload(file.buffer, `trailers/${movie._id}/orignal`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  const mediaConvertRes = await aws.convertVideo(
    `trailers/${movie._id}/orignal`,
    [1080],
    `trailers/${movie._id}/`,
  );
  if (mediaConvertRes.status != 200)
    return res.status(500).json({ error: "error converting video" });

  Movie.findByIdAndUpdate(movie._id, {
    trailerUrl: aws.getS3Url(`trailers/${movie._id}/orignal-1080.m3u8`),
  });

  return res.json({ message: "success" });
}

async function deleteMovie(req, res) {
  const movie = Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  const s3res = await aws.deleteFile(`movies/${movie._id}`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  return res.json({ message: "success" });
}

async function deleteTrailer(req, res) {
  const movie = Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  const s3res = await aws.deleteFile(`trailers/${movie._id}`);
  if (s3res.status != 200)
    return res.status(500).json({ error: "error uploading to s3" });

  return res.json({ message: "success" });
}

module.exports = {
  getAllMovies,
  getMovie,
  uploadMovie,
  uploadTrailer,
  deleteMovie,
  deleteTrailer,
};

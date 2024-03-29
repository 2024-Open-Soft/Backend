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
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.upload(file.buffer, `movies/${movie._id}/orignal`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  try {
    await aws.convertVideo(
      `movies/${movie._id}/orignal`,
      [360, 720, 1080],
      `movies/${movie._id}/`,
    );
  } catch (e) {
    return res.status(500).json({ error: "error converting video" });
  }

  return res.json({ message: "success" });
}

async function deleteMovie(req, res) {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.deleteFile(`movies/${movie._id}`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  return res.json({ message: "success" });
}

async function uploadTrailer(req, res) {
  const file = req.file;
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.upload(file.buffer, `trailers/${movie._id}/orignal`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  try {
    await aws.convertVideo(
      `trailers/${movie._id}/orignal`,
      [1080],
      `trailers/${movie._id}/`,
    );
  } catch (e) {
    return res.status(500).json({ error: "error converting video" });
  }

  await Movie.findByIdAndUpdate(movie._id, {
    trailer: aws.getS3Url(`trailers/${movie._id}/orignal-1080.m3u8`),
  });

  return res.json({ message: "success" });
}

async function deleteTrailer(req, res) {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.deleteFile(`trailers/${movie._id}`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  return res.json({ message: "success" });
}

async function uploadPoster(req, res) {
  const file = req.file;
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.upload(file.buffer, `posters/${movie._id}`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  await Movie.findByIdAndUpdate(movie._id, {
    poster: aws.getS3Url(`posters/${movie._id}/orignal-1080.m3u8`),
  });

  return res.json({ message: "success" });
}

async function deletePoster(req, res) {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.deleteFile(`posters/${movie._id}`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  return res.json({ message: "success" });
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
  uploadMovie,
  updateMovie,
  uploadMovieFile,
  uploadTrailer,
  deleteMovie,
  deleteTrailer,
  uploadPoster,
  deletePoster,
};

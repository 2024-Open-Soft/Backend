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

async function uploadMovieFile(req, res) {
  const file = req.file;
  console.log("moviefile : ", file);
  console.log("body : ", req.body);
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) return res.status(400).json({ error: "not a valid movie id" });

  try {
    await aws.upload(file.buffer, `movies/${movie._id}/original`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  try {
    await aws.convertVideo(
      `movies/${movie._id}/original`,
      [360, 720, 1080],
      `movies/${movie._id}/`
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
    await aws.deleteFile(`posters/${movie._id}`);
    await aws.deleteFile(`trailers/${movie._id}`);
    await aws.deleteFile(`movies/${movie._id}`);
    await Movie.findByIdAndDelete(movie._id);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  return res.json({ message: "success" });
}

async function deleteMovieVideo(req, res) {
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
    await aws.upload(file.buffer, `trailers/${movie._id}/original`);
  } catch (e) {
    return res.status(500).json({ error: "error uploading to s3" });
  }

  try {
    await aws.convertVideo(
      `trailers/${movie._id}/original`,
      [1080],
      `trailers/${movie._id}/`
    );
  } catch (e) {
    return res.status(500).json({ error: "error converting video" });
  }

  await Movie.findByIdAndUpdate(movie._id, {
    trailer: aws.getS3Url(`trailers/${movie._id}/original-1080.m3u8`),
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
    poster: aws.getS3Url(`posters/${movie._id}/original-1080.m3u8`),
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

const uploadMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    return res.status(200).json({
      data: {
        movie,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      IMDB = -1,
      actors = "",
      date = "",
      rated = "",
      languages = "",
      plot = "",
      title = "",
      writers = "",
      year = -1,
    } = req.body;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (date != "") {
      // check if date is valid
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ error: "Invalid date" });
      }
      movie.released = date;
    }
    if (IMDB !== -1) movie.imdb.rating = IMDB;
    if (actors != "") movie.cast = actors.split(", ");
    if (rated != "") movie.rated = rated;
    if (languages != "") movie.languages = languages.split(", ");
    if (plot != "") movie.plot = plot;
    if (title != "") movie.title = title;
    if (writers != "") movie.writers = writers.split(", ");
    if (year != -1) movie.year = year;
    await movie.save();

    if (!id) {
      return res.status(404).json({ error: "Movie not found" });
    }
    return res.status(200).json({
      message: "Movie updated successfully",
      data: {
        movie,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllMovies,
  getMovie,
  uploadMovie,
  updateMovie,
  uploadMovieFile,
  uploadTrailer,
  deleteMovie,
  deleteMovieVideo,
  deleteTrailer,
  uploadPoster,
  deletePoster,
};

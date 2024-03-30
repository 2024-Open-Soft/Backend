const Movie = require("../models/movie");

const searchOnEnter = async (req, res) => {
  try {
    // setpage to 1 and flag to default 0 if not provided
    let { query, page = 1, flag = 0 } = req.query;
    const pageSize = 25;
    let movies = [];
    page = parseInt(page);
    flag = parseInt(flag);
    query = query.replace(/\s+/g, " ").trim();
    if (!query || page < 1 || flag < 0 || flag > 1) {
      return res.json({
        message: "Success",
        data: {
          movies: [],
          count: 0,
        },
      });
    }
    queryForRegex = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    //flag determines if regex needs to be done or fuzzy. 1 for fuzzy, 0 for regex
    if (flag) {
      // if user query has consecutive spaces, replace them with a single space
      const regexMovies = await Movie.find(
        { title: { $regex: "^" + queryForRegex, $options: "i" } },
        { title: 1, _id: 1, poster: 1 },
      );
      const regexMoviesLength = regexMovies.length;
      page = page - Math.ceil(regexMoviesLength / pageSize);
      // but if regexMoviesLength is exact multiple of pageSize then page should be 1 less
      if (regexMoviesLength % pageSize === 0) {
        page = page - 1;
      }
      const skip = (page - 1) * pageSize;
      movies = await Movie.aggregate([
        {
          $search: {
            index: "movieTitleAutocomplete",
            compound: {
              must: [
                {
                  autocomplete: {
                    query: query,
                    path: "title",
                    fuzzy: { maxEdits: 2, prefixLength: 1, maxExpansions: 256 },
                  },
                },
              ],
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "title",
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "title",
                    fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
                  },
                },
              ],
            },
          },
        },
        { $skip: skip },
        { $limit: pageSize },
        { $project: { _id: 1, title: 1, poster: 1 } },
      ]);
      // for each movie in movies, check if it is already present in regexMovies , if it is already there then remove it from movies
      movies = movies.filter(
        (movie) =>
          !regexMovies.some(
            (regexMovie) => regexMovie._id.toString() === movie._id.toString(),
          ),
      );
    } else {
      const skip = (page - 1) * pageSize;
      movies = await Movie.find(
        { title: { $regex: "^" + queryForRegex, $options: "i" } },
        { title: 1, _id: 1, poster: 1 },
      )
        .skip(skip)
        .limit(pageSize);
    }
    res.json({
      message: "Success",
      data: {
        movies: movies,
        count: movies.length,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = searchOnEnter;

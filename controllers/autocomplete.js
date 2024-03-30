const Movie = require("../models/movie");

const autocomplete = async (req, res) => {
  try {
    let { query } = req.query;
    queryForRegex = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    if (!query) {
      return res.json({
        message: "Success",
        data: {
          movies: [],
          count: 0,
        },
      });
    }

    const [regexPromise, autocompletePromise] = [
      Movie.find(
        { title: { $regex: "^" + queryForRegex, $options: "i" } },
        { title: 1, _id: 1 },
      ).limit(15),
      Movie.aggregate([
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
        { $limit: 15 }, // Initial limit
        { $project: { _id: 1, title: 1 } },
      ]),
    ];

    let startTime = performance.now();
    const [movies2, movies1] = await Promise.all([
      regexPromise,
      autocompletePromise,
    ]);

    // Adjust merging logic to stop when 15 docs are reached
    startTime = performance.now();
    let regexSearchCount = movies2.length;
    let finalMovies = movies2;
    let mergedCount = movies2.length;
    const movie2Ids = movies2.map((movie) => movie._id.toString());
    for (let i = 0; i < movies1.length && mergedCount < 15; i++) {
      const movie = movies1[i];
      if (!movie2Ids.includes(movie._id.toString())) {
        finalMovies.push(movie);
        mergedCount++;
      }
    }

    res.json({
      message: "Success",
      data: {
        movies: finalMovies,
        count: finalMovies.length,
        tabComplete: regexSearchCount > 0 ? movies2[0].title : null,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = autocomplete;

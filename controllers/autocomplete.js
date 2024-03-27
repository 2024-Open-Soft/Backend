const xlsx = require("xlsx-populate");
const Movie = require("../models/movie");
const { performance } = require("perf_hooks");

const autocomplete = async (req, res) => {
  try {
    let { query } = req.query;
    query = query.replace(/\s+/g, " ").trim();
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

    let totalTime = performance.now();

    const [regexPromise, autocompletePromise] = [
      Movie.find(
        { title: { $regex: "^" + queryForRegex, $options: "i" } },
        { title: 1, _id: 1 }
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
    let combinedSearchTime = performance.now() - startTime;

    // Adjust merging logic to stop when 15 docs are reached
    startTime = performance.now();
    let regexSearchCount = movies2.length;
    let finalMovies = movies2;
    let mergedCount = movies2.length;
    // console.log("regex movies length", movies2.length);
    const movie2Ids = movies2.map((movie) => movie._id.toString());
    for (let i = 0; i < movies1.length && mergedCount < 15; i++) {
      const movie = movies1[i];
      if (!movie2Ids.includes(movie._id.toString())) {
        finalMovies.push(movie);
        mergedCount++;
      }
    }

    let mergingTime = performance.now() - startTime;

    let totalRuntime = performance.now() - totalTime;

    const workbook = await xlsx.fromFileAsync(
      "opensoft-autocomplete-results.xlsx"
    );
    const sheet = workbook.sheet("Sheet1");

    sheet.cell("A1").value("Query");
    sheet.cell("B1").value("Tab Complete");
    sheet.cell("C1").value("Regex Matches");
    sheet.cell("D1").value("Exact and Fuzzy Matches");
    sheet.cell("E1").value("Total Matches");
    // sheet.cell("F1").value("Regex Time (ms)");
    sheet.cell("F1").value("Combined Search Time (ms)");
    sheet.cell("G1").value("Merging Time (ms)");
    sheet.cell("H1").value("Total Runtime (ms)");

    for (let i = 0; i < 15; i++) {
      sheet.cell(1, 10 + i).value(`Result ${i + 1}`);
    }

    let lastRow = sheet.usedRange().endCell().rowNumber();
    sheet.cell(`A${lastRow + 1}`).value(query);
    // console.log("regex movies length", movies2.length);
    sheet
      .cell(`B${lastRow + 1}`)
      .value(regexSearchCount > 0 ? movies2[0].title : null);
    sheet.cell(`C${lastRow + 1}`).value(regexSearchCount);
    sheet.cell(`D${lastRow + 1}`).value(finalMovies.length - regexSearchCount);
    sheet.cell(`E${lastRow + 1}`).value(finalMovies.length);
    sheet.cell(`F${lastRow + 1}`).value(combinedSearchTime);
    sheet.cell(`G${lastRow + 1}`).value(mergingTime);
    sheet.cell(`H${lastRow + 1}`).value(totalRuntime);

    for (let i = 0; i < 15; i++) {
      sheet
        .cell(lastRow + 1, 10 + i)
        .value(finalMovies[i] ? finalMovies[i].title : null);
    }

    await workbook.toFileAsync("opensoft-autocomplete-results.xlsx");

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

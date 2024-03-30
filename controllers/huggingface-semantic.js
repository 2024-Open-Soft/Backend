const Movie = require("../models/movie");
const { getEmbedding, findSimilarDocuments } = require("./huggingface-embed-functions");

const HUGGINGFACE_API_KEY_1 = process.env.HUGGINGFACE_API_KEY_1;
const HUGGINGFACE_API_KEY_2 = process.env.HUGGINGFACE_API_KEY_2;

const semantic = async (req, res) => {
  const query = req.query.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 15;

  let movies = [];
  if (!query.trim() || page < 1) {
    return res.json({
      message: "Success",
      data: {
        movies: [],
        count: 0,
      },
    });
  }

  try {
    let embedding;
    try {
      embedding = await getEmbedding(query, 1, HUGGINGFACE_API_KEY_1);
    } catch (error) {
      console.error("Error with first API key:", error.message);
      try {
        console.log("Waiting 3 seconds before retrying with second key...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        embedding = await getEmbedding(query, 1, HUGGINGFACE_API_KEY_2);
      } catch (error) {
        console.error("Error with second API key:", error.message);
        throw error; // Re-throw if both attempts fail
      }
    }

    movies = await findSimilarDocuments(embedding, limit, page);
    res.json({
      message: "Success",
      data: {
        movies: movies,
        count: movies.length,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ error: "External Server Error" });
  }
};

module.exports = semantic;

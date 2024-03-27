const Movie = require("../models/movie.js");
const { getEmbedding, findSimilarDocuments } = require("./embed-functions.js");
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const semantic = async (req, res) => {
  const query = req.query.query;
  let movies = [];
  // if query is nothing but whitespace, return empty array
  if (!query.trim()) {
    return res.json(movies);
  }
  try {
    const embedding = await getEmbedding(query,1,HUGGINGFACE_API_KEY);
    movies = await findSimilarDocuments(embedding);
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ error: "External Server Error" });
  }
  res.json(movies);
};
module.exports = semantic;

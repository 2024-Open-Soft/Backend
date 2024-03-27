const Movie = require("../models/movie");
const { getEmbedding, findSimilarDocuments } = require("./embed-functions.js");
const semantic = async (req, res) => {
  const query = req.body.query;
  let movies = [];
  try {
    const embedding = await getEmbedding(query);
    movies = await findSimilarDocuments(embedding);
  } catch (err) {
    console.error(err);
  }
  res.json(movies);
};
module.exports = semantic;

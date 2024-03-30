const axios = require("axios");
const Movie = require("../models/movie.js");
async function getEmbedding(query, upto, key) {
  const url =
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  const headers = {
    Authorization: `Bearer ${key}`,
  };

  const data = {
    inputs: query,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.log("error in embedding ", upto);
    throw error; // Re-throw the error for further handling
  }
}
async function findSimilarDocuments(embedding, limit, page) {
  try {
    const movies = await Movie.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "plot_embedding",
          queryVector: embedding,
          numCandidates: 500,
          limit: 100,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          plot: 1,
          _id: 0,
        },
      },
    ]);
    return movies;
  } catch (err) {
    throw err;
  }
}
module.exports = { getEmbedding, findSimilarDocuments };

const axios = require("axios");
const Movie = require("../models/movie.js");
async function getEmbedding(query, upto, openai_key) {
  // Define the OpenAI API url and key.
  const url = process.env.OPENAI_API_URL;
  try {
    let response = await axios.post(
      url,
      {
        input: query,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          Authorization: `Bearer ${openai_key}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data.data[0].embedding;
    } else {
      throw new Error(
        `Failed to get embedding. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.log("error in embedding ", upto);
    throw error; // Re-throw the error for further handling
  }
  // Call OpenAI API to get the embeddings.
}
async function findSimilarDocuments(embedding, limit, page) {
  try {
    const movies = await Movie.aggregate([
      {
        $vectorSearch: {
          index: "vector_index_openai",
          path: "openai_embedding",
          queryVector: embedding,
          numCandidates: 200,
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
          _id: 1,
        },
      },
    ]);
    return movies;
  } catch (err) {
    throw err;
  }
}
module.exports = { getEmbedding, findSimilarDocuments };
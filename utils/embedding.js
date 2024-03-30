const axios = require("axios");

async function getEmbedding(query) {
  // Define the OpenAI API url and key.
  const url = "https://api.openai.com/v1/embeddings";
  const openai_key = process.env.OPENAI_SECRET_KEY;

  // Call OpenAI API to get the embeddings.
  let response = await axios
    .post(
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
      },
    )
    .catch((e) => console.log(e.toString()));

  if (response.status == 200) {
    return response.data.data[0].embedding;
  } else {
    throw new Error(`Failed to get embedding. Status code: ${response.status}`);
  }
}
async function findSimilarDocuments(embedding) {
  // const url = process.env.DATABASE_URL; // Replace with your MongoDB url.
  // const client = new MongoClient(url);

  try {
    // await client.connect();

    // const db = client.db('<DB_NAME>'); // Replace with your database name.
    // const collection = db.collection('<COLLECTION_NAME>'); // Replace with your collection name.

    // Query for similar documents.
    const movies = await db.embedded_movies.aggregateRaw({
      pipeline: [
        {
          $vectorSearch: {
            queryVector: embedding,
            path: "plot_embedding",
            numCandidates: 100,
            limit: 5,
            index: "vector_index",
          },
        },
        {
          $project: {
            title: 1,
            _id: 0,
          },
        },
      ],
    });

    return documents;
  } catch (err) {
    console.error(err);
  }
  //   } finally {
  //     await client.close();
  //   }
}
module.exports = { getEmbedding, findSimilarDocuments };


const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}

// nested collection
const AwardsSchema = new Schema({
  nominations: Number,
  text: String,
  wins: Number,
});

// nested collection
const ImdbSchema = new Schema({
  id: Number,
  rating: Schema.Types.Mixed,
  votes: Schema.Types.Mixed,
});

// nested collection
const TomatoesReviewSchema = new Schema({
  meter: Number,
  numReviews: Number,
  rating: Number,
});

// nested collection
const TomatoesSchema = new Schema({
  boxOffice: String,
  consensus: String,
  critic: TomatoesReviewSchema,
  dvd: Date,
  fresh: Number,
  lastUpdated: Date,
  production: String,
  rotten: Number,
  viewer: TomatoesReviewSchema,
  website: String,
});

const MovieSchema = new Schema({
  awards: AwardsSchema,
  cast: [String],
  countries: [String],
  directors: [String],
  fullplot: String,
  genres: [String],
  imdb: ImdbSchema,
  languages: [String],
  lastupdated: String,
  metacritic: Number,
  num_mflix_comments: Number,
  plot: String,
  plot_embedding: [Number],
  poster: String,
  rated: String,
  released: Date,
  runtime: Number,
  title: String,
  tomatoes: TomatoesSchema,
  type: String,
  writers: [String],
  year: Number,
  comments: [ref("Comment")],
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;

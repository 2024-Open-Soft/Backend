const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmbeddedMoviesAwardsSchema = new Schema({
  nominations: Number,
  text: String,
  wins: Number
});

const EmbeddedMoviesImdbSchema = new Schema({
  id: Number,
  rating: Schema.Types.Mixed,
  votes: Schema.Types.Mixed
});

const EmbeddedMoviesTomatoesCriticSchema = new Schema({
  meter: Number,
  numReviews: Number,
  rating: Number
});

const EmbeddedMoviesTomatoesViewerSchema = new Schema({
  meter: Number,
  numReviews: Number,
  rating: Number
});

const EmbeddedMoviesTomatoesSchema = new Schema({
  boxOffice: String,
  consensus: String,
  critic: EmbeddedMoviesTomatoesCriticSchema,
  dvd: Date,
  fresh: Number,
  lastUpdated: Date,
  production: String,
  rotten: Number,
  viewer: EmbeddedMoviesTomatoesViewerSchema,
  website: String
});

const MoviesAwardsSchema = new Schema({
  nominations: Number,
  text: String,
  wins: Number
});

const MoviesImdbSchema = new Schema({
  id: Number,
  rating: Schema.Types.Mixed,
  votes: Schema.Types.Mixed
});

const MoviesTomatoesCriticSchema = new Schema({
  meter: Number,
  numReviews: Number,
  rating: Number
});

const MoviesTomatoesViewerSchema = new Schema({
  meter: Number,
  numReviews: Number,
  rating: Number
});

const MoviesTomatoesSchema = new Schema({
  boxOffice: String,
  consensus: String,
  critic: MoviesTomatoesCriticSchema,
  dvd: Date,
  fresh: Number,
  lastUpdated: Date,
  production: String,
  rotten: Number,
  viewer: MoviesTomatoesViewerSchema,
  website: String
});

const TheatersLocationAddressSchema = new Schema({
  city: String,
  state: String,
  street1: String,
  street2: String,
  zipcode: String
});

const TheatersLocationGeoSchema = new Schema({
  coordinates: [Number],
  type: String
});

const MobileNumberSchema = new Schema({
  countryCode: String,
  phoneNumber: String
});

const HistorySchema = new Schema({
  movie_id: String,
  timeStamp: { type: String, default: "00:00:00" }
});

const CommentsSchema = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  date: Date,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  movieId: { type: Schema.Types.ObjectId, ref: 'embedded_movies' },
  parentId: String,
  text: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const EmbeddedMoviesSchema = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  awards: EmbeddedMoviesAwardsSchema,
  cast: [String],
  countries: [String],
  directors: [String],
  fullplot: String,
  genres: [String],
  imdb: EmbeddedMoviesImdbSchema,
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
  tomatoes: EmbeddedMoviesTomatoesSchema,
  type: String,
  writers: [String],
  year: Number,
  User: { type: Schema.Types.ObjectId, ref: 'User' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [CommentsSchema]
});

const UserSchema = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  phone: MobileNumberSchema,
  isAdmin: { type: Boolean, default: false },
  paymentToken: String,
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'SubscriptionState' }],
  genres: [String],
  languages: [String],
  history: [HistorySchema],
  watchLater: [{ type: Schema.Types.ObjectId, ref: 'embedded_movies' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  comments: [CommentsSchema]
});

const SubscriptionStateSchema = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscriptions' },
  status: String,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const SubscriptionsSchema = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  type: String,
  price: Number,
  discountPercentage: Number,
  features: [{ type: Schema.Types.ObjectId, ref: 'SubscriptionFeatures' }],
  discount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const SubscriptionFeaturesSchema = new Schema({
  featureId: { type: String, default: () => new mongoose.Types.ObjectId() },
  featureName: String,
  featureDescription: String,
  featureValue: String,
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscriptions' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model("User", UserSchema);

// module.exports = {
//   EmbeddedMoviesAwardsSchema,
//   EmbeddedMoviesImdbSchema,
//   EmbeddedMoviesTomatoesCriticSchema,
//   EmbeddedMoviesTomatoesViewerSchema,
//   EmbeddedMoviesTomatoesSchema,
//   MoviesAwardsSchema,
//   MoviesImdbSchema,
//   MoviesTomatoesCriticSchema,
//   MoviesTomatoesViewerSchema,
//   MoviesTomatoesSchema,
//   TheatersLocationAddressSchema,
//   TheatersLocationGeoSchema,
//   MobileNumberSchema,
//   HistorySchema,
//   CommentsSchema,
//   EmbeddedMoviesSchema,
//   UserSchema,
//   SubscriptionStateSchema,
//   SubscriptionsSchema,
//   SubscriptionFeaturesSchema
// };

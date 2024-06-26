const { Comment, Movie, SubscriptionPlan } = require("../models");

const createUserObject = async (user) => {
  const data = user.toObject();

  delete data.password;
  delete data.subscriptions;
  delete data.history;
  delete data.watchLater;
  delete data.tokens;
  delete data.payments;

  const watchLater = [],
    history = [],
    comments = [],
    subscriptions = [],
    payments = [];

  for (let i in user.watchLater) {
    const movie = await Movie.findById(user.watchLater[i]);
    watchLater.push({
      title: movie.title,
      _id: movie._id,
      poster: movie.poster,
      runtime: movie.runtime,
    });
  }

  for (let i in user.history) {
    const movie = await Movie.findById(user.history[i].movie);
    history.push({
      title: movie.title,
      _id: movie._id,
      poster: movie.poster,
      timeStamp: user.history[i].timeStamp,
      runtime: movie.runtime,
    });
  }

  for (let i in user.subscriptions) {
    const plan = await SubscriptionPlan.findById(user.subscriptions[i].plan);
    subscriptions.push({
      ...user.subscriptions[i].toObject(),
      title: plan.name,
      price: plan.price,
      features: plan.features,
      discountPercentage: plan.discountPercentage,
    });
  }

  for (let i in user.comments) {
    const comment = await Comment.findById(user.comments[i]);
    comments.push(comment);
  }

  for (let i in user.payments) {
    const plan = await SubscriptionPlan.findById(user.payments[i].plan);
    payments.push({ ...user.payments[i].toObject(), title: plan.name });
  }

  return { ...data, history, watchLater, comments, subscriptions, payments };
};

module.exports = { createUserObject };

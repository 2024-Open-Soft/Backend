// imports
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { getfeaturedMovie } = require("./controllers/movie")


// webserver init
const app = express();
const PORT = process.env.PORT || 3002;

// middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());

const routes = require("./routes");

// routes
for (let prefix in routes) {
  app.use(`/${prefix}`, routes[prefix]);
}

app.get("/featured", getfeaturedMovie);

app.all('*', (req, res, next) => {
  return res.status(404).json({ message: `Can't find ${req.url} on the server` })
});


// const Movie = require("./models/movie");

// const User = require("./models/user");





async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Test on http://localhost:${PORT}/`);
  });


  // // write a script to add a new field 'isReleased' to all the documents in the 'movies' collection and set it to 'false' by default
  // Movie.updateMany({}, { $set: { isReleased: false } })
  // .then(res => {
  //   console.log("Documents updated", res);
  // })
  // .catch(err => {
  //   console.log("Error updating documents", err);
  // });


  // // write a script to change all the names of the users to 'user 1', 'user 2' and so on in the 'users' collection
  // User.find({})
  //   .then(users => {
  //     let updatePromises = users.map((user, index) => {
  //       return User.updateOne({ _id: user._id }, { $set: { name: `User ${index + 1}` } });
  //     });
  //     return Promise.all(updatePromises);
  //   })
  //   .then(() => {
  //     console.log("Documents updated");
  //   })
  //   .catch(err => {
  //     console.log("Error updating documents", err);
  //   });


  // // write a script to update the emails of the users to 'user1@gmail.com', 'user2@gmail.com' and so on in the 'users' collection
  // User.find({})
  //   .then(users => {
  //     let updatePromises = users.map((user, index) => {
  //       return User.updateOne({ _id: user._id }, { $set: { email: `user${index + 1}@gmail.com` } });
  //     });
  //     return Promise.all(updatePromises);
  //   })
  //   .then((res) => {
  //     console.log("Documents updated", res);
  //   }
  //   )
  //   .catch(err => {
  //     console.log("Error updating documents", err);
  //   });


  // // write a script to change the names of the user with isAdmin: true to 'Admin user 1', 'Admin user 2' and so on using loop in the 'users' collection
  // User.find({ isAdmin: true })
  //   .then(users => {
  //     let updatePromises = users.map((user, index) => {
  //       return User.updateOne({ _id: user._id }, { $set: { name: `Admin user ${index + 1}` } });
  //     }
  //     );
  //     return Promise.all(updatePromises);
  //   }
  //   )
  //   .then((res) => {
  //     console.log("Documents updated", res);
  //   }
  //   )
  //   .catch(err => {
  //     console.log("Error updating documents", err);
  //   });

}

main();

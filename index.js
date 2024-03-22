const express = require("express");
const morgan = require("morgan");
const app = express();

const otpRoutes = require("./routes/otpRoutes");
const movieRoutes = require("./routes/movieRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

// const mongoose = require('mongoose');

const PORT = 3001;

app.use(express.json());
app.use(morgan("tiny"));

app.use("/otp", otpRoutes);
app.use("/movie", movieRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(process.env.DATABASE_URL).then(() => {
//     app.listen(PORT, () => {
//         console.log(`App listening on port ${PORT}`)
//     })
// });.

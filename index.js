const express = require("express");
const morgan = require("morgan");
const app = express();

const otpRoutes = require("./routes/otpRoutes");

require("dotenv").config();

// const mongoose = require('mongoose');

require('dotenv').config();

const PORT = 3001;
const loginRoutes = require('./routes/loginRoutes');

app.use(express.json());
app.use('/user', loginRoutes);
app.use(express.json());
app.use(morgan("tiny"));

app.use("/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(process.env.DATABASE_URL).then(() => {
//     app.listen(PORT, () => {
//         console.log(`App listening on port ${PORT}`)
//     })
// });.

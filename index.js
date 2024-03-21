const express = require("express");
const app = express();

const otpRoutes = require("./routes/otpRoutes");

require("dotenv").config();

// const mongoose = require('mongoose');

const PORT = 3001;

app.use(express.json());

app.use("/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(process.env.DATABASE_URL).then(() => {
//     app.listen(PORT, () => {
//         console.log(`App listening on port ${PORT}`)
//     })
// });.

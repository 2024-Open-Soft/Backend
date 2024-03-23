const express = require("express");
const morgan = require("morgan");
const app = express();

const otpRoutes = require("./routes/otpRoutes");
const movieRoutes=require("./routes/movie_filter");

require("dotenv").config();

// const mongoose = require('mongoose');

const PORT = 3001;

app.use(express.json());
app.use(morgan("tiny"));

app.use("/otp", otpRoutes);

// indicate to use the route 
app.use("/movie/filter",movieRoutes);
// just defining an new .get api

app.get("/",(req,res)=>{
  res.send("Hello, how are you?");
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(process.env.DATABASE_URL).then(() => {
//     app.listen(PORT, () => {
//         console.log(`App listening on port ${PORT}`)
//     })
// });.

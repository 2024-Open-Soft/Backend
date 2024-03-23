const express = require('express')
const app = express()
const otpRoutes = require('./routes/otpRoutes')
const register_routes = require('./routes/register_routes')
const loginRoutes = require('./routes/loginRoutes');
const movieRoutes = require('./routes/movieRoutes');

// const comment_routes = require('./routes/comment_route')
const morgan = require('morgan')
require("dotenv").config();
const PORT = 3001;


app.use(express.json());
app.use(morgan("tiny"));
app.use('/user', register_routes);
app.use('/user', loginRoutes);
app.use("/otp", otpRoutes);
app.use("/movie", movieRoutes);
// app.use('/movie', comment_routes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const express = require('express')
const morgan = require('morgan')
const app = express()

const otpRoutes = require('./routes/otpRoutes')
const register_routes = require('./routes/register_routes')
const loginRoutes = require('./routes/loginRoutes');
// const comment_routes = require('./routes/comment_route')
const movieRoutes = require("./routes/movieRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();
const PORT = 3001;


app.use(express.json());
app.use(morgan("tiny"));
app.use('/user', register_routes);
app.use('/user', loginRoutes);
app.use("/otp", otpRoutes);
// app.use("/movie", movieRoutes);
// app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

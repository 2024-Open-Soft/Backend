const express = require('express')
const app = express()
const otpRoutes = require('./routes/otpRoutes')
const register_routes = require('./routes/register_routes')
// const comment_routes = require('./routes/comment_route')
const morgan = require('morgan')
const PORT = 3001;

app.use(express.json());
app.use(morgan("tiny"));

app.use(express.json());
app.use('/user', register_routes);
// app.use('/movie', comment_routes);

app.use("/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

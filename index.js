require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

const otpRoutes = require("./routes/otpRoutes");
const register_routes = require("./routes/register_routes");
const loginRoutes = require("./routes/loginRoutes");
// const comment_routes = require('./routes/comment_route')
const movieRoutes = require("./routes/movieRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(morgan("tiny"));
app.use("/user", register_routes);
app.use("/user", loginRoutes);
app.use("/otp", otpRoutes);
app.use("/movie", movieRoutes);
// app.use("/admin", adminRoutes);

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Test on http://localhost:${PORT}/`);
  });
}

main();

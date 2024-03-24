require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otpRoutes");
const register_routes = require("./routes/register_routes");
const loginRoutes = require("./routes/loginRoutes");
const movieRoutes = require("./routes/movieRoutes");
const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use(express.json());
app.use(morgan("tiny"));
app.use("/user", register_routes);
app.use("/user", loginRoutes);
app.use("/user", userRoutes);

app.use("/otp", otpRoutes);

app.use("/movie", movieRoutes);
app.use("/movie", commentRoutes);

app.use("/admin", adminRoutes);

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Test on http://localhost:${PORT}/`);
  });
}

main();

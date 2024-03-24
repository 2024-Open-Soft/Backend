// imports
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// webserver init
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(express.json());
app.use(morgan("tiny"));

const routes = require("./routes");

// routes
for (let prefix in routes) {
  app.use(`/${prefix}`, routes[prefix]);
}

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Test on http://localhost:${PORT}/`);
  });
}

main();

const express = require("express");
const app = express();

const otpRoutes = require("./routes/otpRoutes");

require("dotenv").config();

const PORT = 3001;

app.use(express.json());

app.use("/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


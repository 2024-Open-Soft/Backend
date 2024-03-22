const express = require('express')
const app = express()
const register_routes = require('./routes/register_routes')
const comment_routes = require('./routes/comment_route')
const { PrismaClient } = require('@prisma/client');
const PORT = 3001;

app.use(express.json());
app.use(morgan("tiny"));
// register(app);/

app.use(express.json());
app.use('/user', register_routes);
app.use('/movie', comment_routes);

app.use("/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(process.env.DATABASE_URL).then(() => {
//     app.listen(PORT, () => {
//         console.log(`App listening on port ${PORT}`)
//     })
// });.

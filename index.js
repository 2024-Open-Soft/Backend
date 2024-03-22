const express = require('express')
const app = express()
const register_routes = require('./routes/register_routes')
const comment_routes = require('./routes/comment_route')
const { PrismaClient } = require('@prisma/client');
const PORT = 3001;

// register(app);/

app.use(express.json());
app.use('/user', register_routes);
app.use('/movie', comment_routes);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
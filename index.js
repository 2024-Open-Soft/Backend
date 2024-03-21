const express = require('express')
const app = express()

require('dotenv').config();

const PORT = 3001;

const loginRoutes = require('./routes/loginRoutes');

app.use(express.json());
app.use('/user', loginRoutes);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
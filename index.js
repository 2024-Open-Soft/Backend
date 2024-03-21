const express = require('express')
const app = express()
const register = require('./controllers/reg')

const PORT = 3001;

// register(app);/

app.use(express.json());
app.use('/user', register);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
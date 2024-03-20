const express = require('express')
const app = express()

const PORT = 3001;

const message = require('./utils/message');

const { generateOtp } = require('./controllers/otpController');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.post('/sendMessage', generateOtp);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
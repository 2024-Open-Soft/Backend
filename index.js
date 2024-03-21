const express = require('express')
const app = express()

const PORT = 3001;

const { generateOtp, verifyOtp } = require('./controllers/otpController');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.post('/opt/generate', generateOtp);
app.post('/opt/verify', verifyOtp);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
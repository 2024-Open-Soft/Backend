const express = require('express')
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');
const getUserData = require('./controllers/getUserData')
const editUserProfile = require('./controllers/editUserProfile')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.get('/user/profile',getUserData.getUserProfile)
app.get('/admin/user', authenticateToken, getUserData.getUsers)
app.get('/admin/user/:id', authenticateToken, getUserData.getUserProfileByAdmin)
app.patch('/user/profile', authenticateToken, editUserProfile.updateUserProfile)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

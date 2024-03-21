const express = require('express')
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');
const userController = require('./controllers/getUserData')

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

app.get('/user/profile',userController.getUserProfile)
app.get('/admin/user', authenticateToken, userController.getUsers)
app.get('/admin/user/:id', authenticateToken, userController.getUserProfileByAdmin)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

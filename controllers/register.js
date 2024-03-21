const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const jwtExpiryTime = 36000;  // JWT expiry time in seconds


router.post('/user/register',  // Register user endpoint
    [check('username', 'username length should be 10 to 30 characters')
        .isLength({ min: 10, max: 30 }),
    check('name', 'Name length should be 10 to 20 characters')
        .isLength({ min: 10, max: 20 }),
    check('password', 'Password length should be 8 to 10 characters')
        .isLength({ min: 8, max: 10 }),
    check('token', 'Token is required').exists()],
    async (req, res) => {   // Register user controller
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, name, password, token } = req.body;  // Get username, name, password and token from request body
            const decoded = jwt.verify(token, JWT_SECRET);  // Verify token

            const existingUser = await prisma.user.findUnique({  // Check if user already exists
                where: {
                    id: decoded.id
                }
            });

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);  // Hash password

            const updatedUser = await prisma.user.update({  // Update user
                where: {
                    id: decoded.id
                },
                data: {
                    username,
                    name,
                    password: hashedPassword,
                }
            });
            const newToken = jwt.sign({ id: updatedUser.id }, JWT_SECRET, { expiresIn: jwtExpiryTime });  // Generate new token or user id
            res.json({ message: "User updated", data: { token: newToken, user: updatedUser } });  // Return token and user data
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    });


module.exports = router;



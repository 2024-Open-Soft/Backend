const JWT_SECRET = process.env.JWT_SECRET;  // Get JWT secret from environment variables
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');
const jwtExpiryTime = 36000;  // JWT expiry time in seconds


const register = async (req, res) => {   // Register user controller
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, password } = req.body;  // Get name, password and token from request body
        const token = req.headers.authorization.split(' ')[1];  // 
        const decoded = jwt.verify(token, JWT_SECRET);  // Verify token

        const existingUser = await prisma.User.findUnique({  // Check if user already exists
            where: {
                id: decoded.id
            }
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash password

        const updatedUser = await prisma.User.update({  // Update user
            where: {
                id: decoded.id
            },
            data: {
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
}

module.exports = register;


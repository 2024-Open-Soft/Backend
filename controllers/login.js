const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { check, validationResult, oneOf } = require('express-validator');
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;
const router = express.Router();

const validateLogin = [
    check('password').notEmpty().withMessage('Password is required'),
    oneOf([
        check('email').isEmail().withMessage('Invalid email format'),
        check('phoneNumber').isMobilePhone().withMessage('Invalid phone number format')
    ]).withMessage('Email or phone number is required')
];



router.post('/user/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, phoneNumber, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNumber }
                ],
            }
        });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        const { password: pass, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;

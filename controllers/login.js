const express = require('express');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = require('process.env');
const router = express.Router();

router.post('/user/login', async (req, res) => {
    try {
        const { email, phoneNumber, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNumber }
                ],
            }
        });
            const hashedpassword=await bycrypt.hash(password,10);   // length of the password is 10 
       
            if (!user) {
            return res.status(401).send('Invalid credentials');
        }

      
        const isPasswordValid = await bycrypt.compare(hashedpassword, user.password);



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
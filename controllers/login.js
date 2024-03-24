const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult, oneOf } = require('express-validator');
const { JWT_SECRET } = process.env;

const User = require('../models/user');


const loginUser = async (req, res) => {
    console.log(req.body)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email = '', phoneNumber = '', password } = req.body;
        
        const user = await User.findOne({
            $or: [
                { phone: phoneNumber },
                { email: email },
            ]
        });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const data = user.toObject();
        const token = jwt.sign({ id: data._id }, JWT_SECRET);
        delete data.password;

        return res.json({
            message: "User logged in",
            data: {
                token,
                user: data
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

module.exports = {
    loginUser
}

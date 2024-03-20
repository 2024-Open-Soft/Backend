const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getUserById(userId) {
    try {
        return await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user by ID');
    }
}


async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        console.log('checkpoint 0')
        const userData = await getUserById(userId);
        console.log('checkpoint 1')
        res.status(200).json(userData);
    } catch (error) {
        console.log('checkpoint 2')
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getUserProfile
}
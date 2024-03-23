const { User } = require('../models');

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: 'Profile fetched successfully',
            data: {
                user,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error fetching profile' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, genre, languages } = req.body;
        user.name = name;
        user.genre = genre;
        user.languages = languages;

        await user.save();
        return res.status(200).json({
            message: 'Profile updated successfully',
            data: {
                user,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error updating profile' });
    }
}

module.exports = {
    getProfile,
    updateProfile,
};
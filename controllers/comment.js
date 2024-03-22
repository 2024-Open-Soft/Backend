const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const comment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { movieId, userId, comment: text } = req.body;

        const existingUser = await prisma.User.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await prisma.User.update({
            where: { id: userId },
            data: {
                comments: {
                    create: {
                        text,
                        movieId,
                    }
                }
            }
        });

        res.json({ message: "Comment added successfully", data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = comment;



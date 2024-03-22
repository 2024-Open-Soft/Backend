const { parseToken } = require("./utils/token");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isLoggedIn = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Authorization token is required" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
    }
    try {
        const data = parseToken(req);
        const user = prisma.user.findUnique({
            where: {
                id: data.userId
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    next();
}
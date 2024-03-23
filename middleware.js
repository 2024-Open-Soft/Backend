const { parseToken } = require("./utils/token");
const { User } = require("./models");

const isLoggedIn = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Authorization token is required" });
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
    }
    try {
        const data = parseToken(req);
        // console.log('data', data)
        const user = await User.findById(data.userId);
        // console.log('user', user)
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

module.exports = {
    isLoggedIn,
    isAdmin
}
const { User } = require("../models");
const { parseToken } = require("../utils/token");

const isLoggedIn = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Authorization token is required" });
  }
  if (!req.headers.authorization.startsWith("Bearer")) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }
  try {
    const data = parseToken(req);
    const user = await User.findById(data.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    req.user = user;
    req.token = token
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};

module.exports = {
  isLoggedIn,
  isAdmin,
};

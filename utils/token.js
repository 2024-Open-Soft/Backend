const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET || "seroweuhnclkhvasouae";

const generateJWT = (data, expiresIn = '10m')=> {
    // console.log(data);
    const token = jwt.sign(data, JWT, { expiresIn: expiresIn});
    // console.log(token);
    return token;
}

const parseToken = req => {
    const token = req.headers.authorization.split(" ")[1];
    return jwt.verify(token, JWT);
}

module.exports = {
    generateJWT,
    parseToken
}
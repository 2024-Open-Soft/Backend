const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET || "seroweuhnclkhvasouae";

const generateJWT = (data, expiresIn = "100m") => {
  const token = jwt.sign(data, JWT, { expiresIn: expiresIn });
  return token;
};

const parseToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  return jwt.verify(token, JWT);
};


const getActiveTokens = (tokens) => {
  for(const token of tokens) {
    try {
      jwt.verify(token, JWT);
    } catch (error) {
      tokens = tokens.filter(t => t !== token);
    }
  }
  return tokens;
}

module.exports = {
  generateJWT,
  parseToken,
  getActiveTokens
};

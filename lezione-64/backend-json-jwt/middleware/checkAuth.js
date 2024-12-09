const { verify } = require("jsonwebtoken");
const jwtKey = require("../shared/key");

module.exports.checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  // Get the token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ error: "Authentication token is required" });
  }

  try {
    const validToken = verify(token, jwtKey.KEY);
    req.token = validToken;
  } catch (error) {
    console.log("Token not valid");
    return res.status(403).json({ error: "Invalid token" });
  }
  next();
};

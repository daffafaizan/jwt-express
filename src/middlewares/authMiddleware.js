// 3rd Party Modules
const jwt = require("jsonwebtoken");

// Local Modules
const env = process.env;

const authenticateUser = (req, res, next) => {
  const accessToken = req.cookies["accessToken"] || req.headers.authorization;
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Access token not provided" });
  }
  try {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    req.userId = decodedAccessToken.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Invalid access token." });
  }
};

module.exports = {
  authenticateUser,
};

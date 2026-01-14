const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    //console.log("401 REJECT: No Bearer token found");
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("403 REJECT: Token invalid/expired");
      return res.sendStatus(403);
    }
    //console.log("JWT VERIFIED: User", decoded.UserInfo.username);
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;

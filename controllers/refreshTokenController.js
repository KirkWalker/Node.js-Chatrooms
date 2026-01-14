const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // Check body (Native) OR cookies (Web fallback)
  //console.log("Full Request Body:", req.body); // Add this

  const refreshToken = req.body.refreshToken || req.cookies?.jwt;

  if (!refreshToken) {
    console.log("No refresh token found in body or cookies");
    return res.sendStatus(401);
  }

  const foundUser = await User.findOne({ refreshToken }).exec();
  //console.log("foundUser", foundUser);
  if (!foundUser) return res.sendStatus(403); //Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    // Send back the access token (and roles if needed)
    res.json({ roles, accessToken });
  });
};
module.exports = { handleRefreshToken };

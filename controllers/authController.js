const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  //console.log("user",user);
  const foundUser = await User.findOne({ username: user }).exec();
  //console.log("foundUser", foundUser);

  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save refreshToken with current user in DB
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // THE CHANGE FOR NATIVE:
    // Send the refreshToken in the body, not just a cookie
    res.json({ roles, accessToken, refreshToken, id: foundUser._id });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

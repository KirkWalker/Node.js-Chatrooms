const User = require("../model/User");

const getAllUsers = async (req, res) => {
  //res.json(data.employees);
  const users = await User.find().select("username roles _id");
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};
module.exports = {
  getAllUsers,
};

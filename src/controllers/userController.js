// Local Modules
const userService = require("../services/userService.js");

// Controllers
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBySlug = async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const user = await userService.getUserBySlug(slug);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    await userService.updateProfile(req);
    res.status(201).json({ message: "User updated!" });
  } catch (err) {
    if (err.message.includes("already exists")) {
      res.status(400).json({ message: err.message });
    }
    if (err.message.includes("Unauthorized")) {
      res.status(401).json({ message: err.message });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserBySlug,
  updateProfile,
};

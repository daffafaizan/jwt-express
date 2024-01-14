// Local Modules
const User = require("../models/user.js");

// Services
const getAllUsers = () => {
  return User.findAll();
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  return user || null;
};

const createUser = async (req) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  if (!name || !username || !password) {
    throw new Error("Name, username, and password are required fields!");
  }
  const existingUsername = await User.findOne({
    where: {
      username: username,
    },
  });
  if (existingUsername) {
    throw new Error("Username already exists!");
  }
  const user = User.create({
    name: name,
    username: username,
    password: password,
  });
  return user;
};

const updateUserById = async (id, req) => {
  const updatedName = req.body.name;
  const updatedUsername = req.body.username;
  const updatedPassword = req.body.password;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    const existingUsername = await User.findOne({
      where: {
        username: updatedUsername,
      },
    });
    if (existingUsername && existingUsername.id != id) {
      throw new Error("Username already exists!");
    }
    user.name = updatedName || user.name;
    user.username = updatedUsername || user.username;
    user.password = updatedPassword || user.password;
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUserById = async (id) => {
  const user = User.findByPk(id);
  if (!user) {
    return null;
  }
  await User.destroy({
    where: {
      id: id,
    },
  });
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};

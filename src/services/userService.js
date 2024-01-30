// Local Modules
const User = require("../models/user.js");

// Services
const getAllUsers = async () => {
  const users = await User.findAll();
  const finalUsers = users.map((user) => {
    const {
      password,
      role,
      accessToken,
      refreshToken,
      createdAt,
      updatedAt,
      ...data
    } = user.toJSON();
    return data;
  });
  return finalUsers;
};

const getUserBySlug = async (slug) => {
  let user;

  const userId = parseInt(slug);
  if (!isNaN(userId) && isFinite(userId)) {
    user = await User.findByPk(userId);
  } else {
    user = await User.findOne({
      where: {
        username: slug,
      },
    });
  }

  if (!user) {
    return null; // User not found
  }

  const {
    password,
    role,
    accessToken,
    refreshToken,
    createdAt,
    updatedAt,
    ...data
  } = user.toJSON();

  return data;
};

const updateProfile = async (req) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    throw new Error("Unauthorized access");
  }
  try {
    const user = await User.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      return null;
    }
    if (refreshToken !== user.refreshToken) {
      throw new Error("Unauthorized access");
    }
    const {
      username: updatedUsername,
      role: updatedRole,
      ...updatedData
    } = req.body;
    if (updatedRole) {
      throw new Error("Unauthorized field change!");
    }
    if (updatedUsername) {
      const existingUsername = await User.findOne({
        where: {
          username: updatedUsername,
        },
      });
      if (
        existingUsername &&
        existingUsername.id != user.id &&
        existingUsername !== user.username
      ) {
        throw new Error("Username already exists!");
      } else {
        user.username = updatedUsername;
      }
    }
    Object.keys(updatedData).forEach((key) => {
      user[key] = updatedData[key];
    });
    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllUsers,
  getUserBySlug,
  updateProfile,
};

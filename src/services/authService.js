// 3rd Party Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local Modules
const env = process.env;
const User = require("../models/user.js");

// Services
const register = async (req) => {
  const salt = await bcrypt.genSalt(10);
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
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = User.build({
    name: name,
    username: username,
    password: hashedPassword,
    accessToken: "",
    refreshToken: "",
  });
  await user.save();
  const { password: userPassword, ...data } = user.toJSON();
  return data;
};

const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    throw new Error("User not found!");
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    throw new Error("Invalid credentials!");
  }
  const id = user.id;
  const accessToken = jwt.sign({ id: id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();
  return { id, accessToken, refreshToken };
};

const logout = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    throw new Error("Refresh token not provided!");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findByPk(decodedRefreshToken.id);
    if (!user) {
      throw new Error("User not found!");
    }

    user.accessToken = "";
    user.refreshToken = "";
    await user.save();
    res.cookie("accessToken", "", {
      maxAge: 0,
    });
    res.cookie("refreshToken", "", {
      maxAge: 0,
    });
  } catch (err) {
    throw new Error("Invalid refresh token!");
  }
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.cookies["refreshToken"] ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!refreshToken) {
    throw new Error("Unauthorized. Refresh token not provided!");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const newAccessToken = jwt.sign(
      { id: decodedRefreshToken.id },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const user = await User.findOne({
      where: {
        refreshToken: req.cookies["refreshToken"],
      },
    });
    if (!user) {
      throw new Error("User not found!");
    }
    user.accessToken = newAccessToken;
    await user.save();
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    return newAccessToken;
  } catch (err) {
    throw new Error("Unauthorized. Invalid refresh token!");
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};

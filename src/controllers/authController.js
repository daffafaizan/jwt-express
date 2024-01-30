// Local Modules
const authService = require("../services/authService.js");

// Controllers
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req);
    res.status(201).json({
      message: "User created!",
      user: user,
    });
  } catch (err) {
    if (err.message.includes("already exists")) {
      res.status(403).json({ error: err.message });
    }
    if (err.message.includes("must be filled")) {
      res.status(400).json({ error: err.message });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { id, accessToken, refreshToken } = await authService.login(req, res);
    if (!id || !accessToken || !refreshToken) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({
      message: "Successfully logged in!",
      data: { id, accessToken, refreshToken },
    });
  } catch (err) {
    if (err.message.includes("Invalid credentials")) {
      res.status(400).json({ error: err.message });
    }
    if (err.message.includes("User not found")) {
      res.status(404).json({ error: err.message });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req, res);
    res.status(200).json({ message: "Successfully logged out!" });
  } catch (err) {
    if (err.message.includes("User not found")) {
      res.status(404).json({ error: err.message });
    }
    if (err.message.includes("not provided")) {
      res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Invalid refresh token")) {
      res.status(400).json({ error: err.message });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const accessToken = await authService.refreshToken(req, res);
    res.status(200).json({
      message: "Access token successfully refreshed!",
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};

const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (role === userRole) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  };
};

module.exports = checkRole;

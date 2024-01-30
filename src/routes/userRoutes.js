// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const userController = require("../controllers/userController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

// User Routes
const userRouter = Router();

userRouter.use(authenticateUser);

userRouter.route("/all").get(userController.getAllUsers);
userRouter.route("/profile").get(userController.getProfile);
userRouter.route("/profile/:slug").get(userController.getUserBySlug);

module.exports = userRouter;

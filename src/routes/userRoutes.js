// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const userController = require("../controllers/userController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

// User Routes
const userRouter = Router();

userRouter.use(authenticateUser);

userRouter.route("/").get(userController.getAllUsers);

userRouter
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = userRouter;

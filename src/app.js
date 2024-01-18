// 3rd Party Modules
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv/config");

// Local Modules
const routes = require("./routes/routes.js");
const env = process.env;
const PORT = env.PORT;

// Server Initialization
app = express();

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["*"],
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server Setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Routes
app.use("/api/v1", routes);

// Global Error Handler for synchronous errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Handle the error gracefully or perform cleanup tasks
  process.exit(1); // Terminate the process after handling the exception
});

// Global Error Handler for asynchronous errors (Promise rejections)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the rejection or log it
});

// Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "Internal server error";
  res.status(status).json({ message: message });
});

// Sync Database and Server Connection
sequelize
  .sync()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server has started on port:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

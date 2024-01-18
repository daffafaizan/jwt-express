# Express.js JWT Authentication Template

This repository serves as a simple JWT authentication and authorization template using Express.js. The template includes a basic user model and implements a straightforward authentication system with a two tokens (access token and refresh token) for verification. It utilizes Postgres as the database and Sequelize as the ORM..

## Features

- User registration with password hashing
- User login with JWT token generation
- Token refresh for long sessions
- Middleware for token verification on protected routes
- Simple user management (Create, Read, Update, and Delete)
- Basic error handling

## How to Use

1. Clone the repository to your local machine.
2. Install the dependencies using `npm install`.
3. Configure your environment variables in the `.env` file.
4. Run the application with `npm start`.

## Routes

Unprotected Routes

- **POST /api/v1/auth/register:** Register a new user.
- **POST /api/v1/auth/login:** Login and receive an access token.
- **POST /api/v1/auth/logout:** Logout and delete the access token.
- **POST /api/v1/auth/refresh-token:** Refresh the access token.

Protected Routes (Requires Authentication)

- **GET /api/v1/users:** Get all users.
- **GET /api/v1/users/:id:** Get a user by id.
- **PATCH /api/v1/users/:id:** Update a user by id.
- **DELETE /api/v1/users/:id:** Delete a user by id.

## Environment Variables

- **PORT:** Port for the server to run on.
- **ACCESS_TOKEN_SECRET:** Secret key for JWT token generation.
- **REFRESH_TOKEN_SECRET:** Secret key for JWT token generation.
- **DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT:** Database configuration.

## Database

This template uses Postgres as the database. Make sure to set up your database and update the environment variables accordingly.

## ORM

The template utilizes Sequelize as the ORM for database interactions.

## Credit

Special thanks to the following YouTube tutorials for providing valuable insights and guidance:

- [Express.js & PostgreSQL REST API - Full Course](https://www.youtube.com/watch?v=IxcKMcsBGE8&t=210s)
- [Node.js Authentication with JWT - Full Course](https://www.youtube.com/watch?v=Uv-jMWV29rU&t=384s)
- [Node.js & Express.js REST API Authentication - Full Course](https://www.youtube.com/watch?v=sDPw2Yp4JwE&t=516s)
- [Node.js Passport Login System Tutorial](https://www.youtube.com/watch?v=favjC6EKFgw&t=15s)

Feel free to explore these tutorials for in-depth explanations and additional learning. This template is open for use and contributions are much appreciated!
Happy coding!

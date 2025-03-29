const express = require("express");

const {
  getRegister,
  register,
  getLogin,
  login,
  logout,
} = require("../controllers/authController");

const userRoutes = express.Router();

//routes
userRoutes.get("/login", getLogin);
//main logic for user login
userRoutes.post("/login", login);

userRoutes.get("/register", getRegister);

//main logic for user registration
userRoutes.post("/register", register);

//logout
userRoutes.get("/logout", logout);

module.exports = userRoutes;

const express = require("express");

const {
  getRegister,
  register,
  getLogin,
  login,
} = require("../controllers/authController");

const userRoutes = express.Router();

//routes
userRoutes.get("/login", getLogin);
//main logic for user login
userRoutes.post("/login", login);

userRoutes.get("/register", getRegister);

//main logic for user registration
userRoutes.post("/register", register);

module.exports = userRoutes;

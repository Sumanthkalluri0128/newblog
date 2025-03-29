const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
exports.getLogin = (req, res) => {
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
    console.log(err, user, info);
  })(req, res, next);
};

exports.getRegister = (req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //save USER
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
};

//Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
};

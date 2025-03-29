require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./config/passport");
const userRoutes = require("./routes/authRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//port
const PORT = process.env.PORT || 3000;

//middlewares passing from data
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUnitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  })
);

//passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//ejs
app.set("view engine", "ejs");
//home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
});
//Routes
app.use("/auth", userRoutes);

//start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch(() => {
    console.log("Database conenction failed");
  });

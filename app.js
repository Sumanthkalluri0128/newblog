require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./config/passport");
const userRoutes = require("./routes/authRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");

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

//method override middleware
app.use(methodOverride("_method"));

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
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
//error handler
app.use(errorHandler);

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

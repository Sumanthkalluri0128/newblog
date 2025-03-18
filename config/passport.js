const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  //Define the local strategy for email and password authentiction
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          //find the user
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "User not found with the email",
            });
          }
          //Compare the password with the hashed pwd in the DB
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }
          //Authentication successful, return the user object
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //serializeuser:determine which data of the user bject should be stored in the session. here we store the user id
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  //deserialize the user object based on the userid stored in the session
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const flash = require("connect-flash"); 

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      console.log('started');
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          console.log('user not found');
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

// Middleware settings
router.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));
router.use(flash()); 
// router.use('/styles', express.static(path.join(__dirname, 'styles')));

router.get('/', (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render('index', {errorMessage });
});

router.post(
  "/log-in",
  (req, res, next) => {
    console.log('Login route hit');
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/user-homepage",
    failureRedirect: "/",
    failureFlash: true
  })
);
module.exports = router;
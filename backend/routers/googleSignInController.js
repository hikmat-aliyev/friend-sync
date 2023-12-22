const express = require('express');
const router = express.Router();
const session = require("express-session");
const passport = require('passport');
const User = require('../models/Users');
require('dotenv').config();

//Login with google account strategy
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
//sign up logic
passport.use('google-sign-in', new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID2,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET2,
  callbackURL: "http://localhost:3000/auth/google/sign-in/callback",
  passReqToCallback   : true
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      // If the user does not exist, return error
      return done(null, false, { message: 'No user found' });
    }
    // Return the user object for serialization
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}
));


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

router.get('/', passport.authenticate('google-sign-in', 
{ scope: ['email', 'profile']}));

router.get('/callback',
  (req, res, next) => {
      console.log('Google callback route hit');
      next();
  }, 
  passport.authenticate('google-sign-in', {
      successRedirect: '/user-homepage',
      failureRedirect: '/auth/google/sign-in/failure'
  })
);

router.get('/failure', (req, res) => {
  res.render('userNotFound')
})

module.exports = router;
const express = require('express');
const router = express.Router();
const session = require("express-session");
const passport = require('passport');
const User = require('../models/Users');
require('dotenv').config();

//Login with google account strategy
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
//sign up logic
passport.use('google-signup', new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback   : true
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    // Find or create the user in the database
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        //Based on properties of profile, create new user
        email: profile.email,
        first_name: profile.given_name,
        last_name: profile.family_name 
      });
      await user.save();
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

router.get('/', 
passport.authenticate('google-signup', {
   scope: ['email', 'profile'], 
   action: 'sign-up' }));


router.get('/callback',
  (req, res, next) => {
      console.log('Google callback route hit');
      next();
  },
  passport.authenticate('google-signup', {
      successRedirect: '/user-homepage',
      failureRedirect: '/auth/google/failure'
  })
);

router.use('/auth/logout', (req, res) => {
req.session.destroy();
res.send('see ya')
})

module.exports = router;
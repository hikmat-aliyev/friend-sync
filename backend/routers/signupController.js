const express = require('express');
const router = express.Router();
const session = require("express-session");
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/Users');
require('dotenv').config();

// Define routes
router.get('/', (req, res) => {
  res.render('signup_page', {errors: []})
});

const user_signup_post = [
  body('email')
  .trim()
  .isEmail()
  .withMessage('Invalid email address.')
  .custom(async (value) => {
    const email = await User.findOne({ email: value })
    if(email){
      throw new Error('Email is already registered!')
    }
    return true;
  }),
  body('first_name')
    .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('last_name')
    .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('password')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Password should be at least 3 characters long.'),
  body('password_confirm')
    .trim()
    .custom((value, {req}) => {
      if(value !== req.body.password){
        throw new Error('Passwords do not match!')
      }
      return true;
    }),

    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      
      try {
        if(!errors.isEmpty()){
          res.render('signup_page', {errors: errors.array()});
          return;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hashedPassword
        })

        await user.save();

        res.redirect('/');
      } catch(err){
        next(err);
      }
    })
]

router.post('/', user_signup_post);

module.exports = router;
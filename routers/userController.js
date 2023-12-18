const express = require('express');
const route = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/Users');

route.get('/', (req, res) => {
  const user = req.user;
  res.render('user_homepage', {user})
});

module.exports = route;
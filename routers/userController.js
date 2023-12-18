const express = require('express');
const route = express.Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/Users');

route.get('/', (req, res) => res.render('user_homepage'));

module.exports = route;
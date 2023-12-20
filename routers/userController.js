const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Posts = require('../models/Posts')

router.get('/', (req, res) => {
  const user = req.user;
  res.render('user_homepage', {user})
});

const handlePostShare = [
  body('post_text')
  .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('Text must be specified.')
    .isLength({max: 200})
    .escape()
    .withMessage('Text should not be more than 200 characters.'),
]

router.post('/post', (req, res) => {
  
})

module.exports = router;
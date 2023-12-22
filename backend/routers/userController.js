const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Posts')

router.get('/', async (req, res) => {
  try {
    const user = req.user;
    const posts = await Post.find({ user: user._id }).exec();
    res.render('user_homepage', { user, errors: [], posts });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
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
    
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      try{
        if(!errors.isEmpty()){
          res.render('user_homepage', {errors: errors.array()});
          return;
        }
        const post = new Post({
          text: req.body.post_text,
          user: req.user._id
        })
        await post.save();
        res.redirect('/user-homepage');
      }catch(err){
        next(err);
      }
    })
]

router.post('/post', handlePostShare)

module.exports = router;
const express = require('express')
const server = express();
require('dotenv').config()

// Parse JSON bodies
server.use(express.json());

// Parse URL-encoded bodies
server.use(express.urlencoded({ extended: true }));
// Set EJS as the view engine
server.set('view engine', 'ejs');

//set up mongoose
const mongoose = require("mongoose");

const mongoDb = process.env.DATABASE_STRING;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Require the router
const indexRouter = require('./routers/indexController');
const signupRouter = require('./routers/signupController');
const userRouter = require('./routers/userController');
const googleSignUpRouter = require('./routers/googleSignupController');
const googleSignInRouter = require('./routers/googleSignInController');
// Use the router
server.use('/', indexRouter);
server.use('/sign-up', signupRouter);
server.use('/user-homepage', userRouter);
server.use('/auth/google', googleSignUpRouter);
server.use('/auth/google/sign-in', googleSignInRouter);
server.use('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express')
const app = express();
require('dotenv').config()

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Set EJS as the view engine
app.set('view engine', 'ejs');

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
// Use the router
app.use('/', indexRouter);
app.use('/sign-up', signupRouter);
app.use('/user-homepage', userRouter);
app.get('/auth/google/success', (req, res) => {
  res.send(`${req.user.displayName}`)
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
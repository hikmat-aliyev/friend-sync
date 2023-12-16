const express = require('express')
const app = express();
require('dotenv').config()

// Set EJS as the view engine
app.set('view engine', 'ejs');

//set up mongoose
const mongoose = require("mongoose");

const mongoDb = process.env.DATABASE_STRING;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Require the router
const mainRouter = require('./routes/index');
// Use the router
app.use('/', mainRouter);
// Define a default route
app.get('/', (req, res) => {
  res.send('Hello from the main app!');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
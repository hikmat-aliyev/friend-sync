const express = require('express')
const app = express();
require('dotenv').config()

// Require the router
const mainRouter = require('./routes/index');
// Use the router
app.use('/', mainRouter);
// Define a default route
app.get('/', (req, res) => {
  res.send('Hello from the main app!');
});
// Define a 404 route
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
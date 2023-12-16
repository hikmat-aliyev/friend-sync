const express = require('express');
const route = express.Router();

// Define routes
route.get('/', (req, res) => {
  res.send('Hello from the router!');
});

route.get('/about', (req, res) => {
  res.send('About page in the router!');
});

module.exports = route;
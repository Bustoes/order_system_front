const express = require('express');
const path = require("path");

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/login")
});
router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/login.html"))
});
router.get('/register', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/register.html"))
});

module.exports = router;

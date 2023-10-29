const express = require('express');
const path = require("path");
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/demo', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/demo.html"));
});
module.exports = router;

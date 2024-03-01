const express = require('express');
const path = require("path");
const router = express.Router();

router.get('/customer', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/html/customer.html"))
});

router.get('/delivery', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/html/delivery.html"))
});

router.get('/staff', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/html/staff.html"))
});

module.exports = router;

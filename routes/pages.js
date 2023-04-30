'use strict';

const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('login');
});

router.get("/register", (req, res) => {
    res.render('register');
});

router.get("/main", (req, res) => {
    res.render('main');
});

module.exports = router;
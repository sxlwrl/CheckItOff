'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.get(['/', '/login'], userController.isLoggedIn, (req, res) => {
    req.user ? res.redirect('/main') : res.render('login');
});

router.get('/register', userController.isLoggedIn, (req, res) => {
    req.user ? res.redirect('/main') : res.render('register');
});

router.get('/main', userController.isLoggedIn, (req, res) => {
    console.log(req.user);
    req.user ? res.render('main', {user: req.user}) : res.redirect('/');
});

module.exports = router;
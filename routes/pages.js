'use strict';

const express = require('express');
const router = express.Router();
const taskModel = require("../models/task-model");
const {authMiddleware} = require('../middlewares/authMiddlewares');
const { preventRedirectMiddleware } = require('../middlewares/preventRedirectMiddleware');

router.get(['/', '/login'], preventRedirectMiddleware, (req, res) => {
    req.user ? res.redirect('/main') : res.render('login');
});

router.get('/register', preventRedirectMiddleware, (req, res) => {
    req.user ? res.redirect('/main') : res.render('register');
});

router.get('/main', authMiddleware, async (req, res) => {
    const tasks = await taskModel.getTasksByUserId(req.user.ID);
    req.user ? res.render('main', {user: req.user, tasks}) : res.redirect('/');
});

module.exports = router;
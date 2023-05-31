'use strict';

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { database } = require('../database/database');

exports.preventRedirectMiddleware = async (req, res, next) => {
    if (req.cookies.account) {
        try {
            const decode = await promisify(jwt.verify)(req.cookies.account, process.env.JWT_SECRET);
            database.query('SELECT * FROM users WHERE id=?', [decode?.id], (error, result) => {
                if (!result) {
                    next();
                }
                req.user = result[0];
                return res.redirect('/main');
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }
    else {
        next();
    }
};
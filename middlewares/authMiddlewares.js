'use strict';

const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const {database} = require('../database/database');

exports.authMiddleware = async (req, res, next) => {
    if (req.cookies.account) {
        try {
            const decode = await promisify(jwt.verify)(req.cookies.account, process.env.JWT_SECRET);
            database.query('SELECT * FROM users WHERE id=?', [decode?.id], (error, result) => {

                if (!result) {
                    res.status(403).redirect('/login');
                }
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            res.status(403).redirect('/login');
        }
    }
    else {
        res.status(403).redirect('/login');
    }
};
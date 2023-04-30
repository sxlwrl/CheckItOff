'use strict';

const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {token} = require("mysql/lib/protocol/Auth");

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

const dayToMilliseconds = function (day) {
    return day * 24 * 60 * 60 * 1000;
}

exports.login = async (req, res) => {
    try {
        let token;
        const {data, password} = req.body;
        if (!data || !password) {
            return res.status(400).render('login',)
        }
        database.query('SELECT * FROM users WHERE username=? OR email=?', [data, data], async (error, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].PASS))) {
                return res.status(401).render('login',);
            }
            else {
                const id = result[0]?.ID;
                token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                console.log(token);
            }

            const cookieOptions = {
                expires: new Date(Date.now() + dayToMilliseconds(process.env.JWT_COOKIE_EXPIRES)),
                httpOnly: true,
            }

            res.cookie('account', token, cookieOptions);
            res.status(200).redirect('/main');
        });
    }
    catch (error) {
        console.log(error);
    }
};

exports.register = (req, res) => {
    const {username, email, password, confirm_password} = req.body;

    database.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {msg: 'Email id already taken'});
        }
        else if (password !== confirm_password) {
            return res.render('register', {msg: "Password isn't correct"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        database.query('INSERT INTO users SET ?', {username: username, email: email, pass: hashedPassword}, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Inserting has been successful');
            }
        });

    });
};
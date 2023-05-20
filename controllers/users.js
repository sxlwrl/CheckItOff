'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const userModel= require('../models/user-model');


const dayToMilliseconds = (day) => (day * 24 * 60 * 60 * 1000);

exports.login = async (req, res) => {
    try {
        const {data, password} = req.body;
        if (!data || !password) {
            return res.status(400).render('login', {msg: `There is an empty field`, msg_type: 'error'});
        }

        const user = await userModel.getUser(data);

        if (!user || !(await userModel.comparePassword(password, user.PASS))) {
            return res.status(401).render('login', {msg: `Email or password isn't correct`, msg_type: 'error'});
        }

        const token = await userModel.generateToken(user.ID);

        const cookieOptions = {
            expires: new Date(Date.now() + dayToMilliseconds(process.env.JWT_COOKIE_EXPIRES)),
            // expires: new Date(Date.now() + 10000),
            httpOnly: true,
        }

        res.cookie(`account`, token, cookieOptions);
        res.status(200).redirect('/main');

    }
    catch (error) {
        console.error(error);
    }
};

exports.register = async (req, res) => {
    const {username, email, password, confirm_password} = req.body;
    console.log(req.body);

    if (!username || !email || !password || !confirm_password) {
        let errorMessage = '';

        (!username || !email) ? errorMessage = `Username or email is not valid` : errorMessage = `Password not entered`;

        return res.status(400).render('register', { msg: errorMessage, msg_type: 'error' });
    }

    if (password !== confirm_password) {
        return res.status(400).render('register', { msg: `Password isn't correct`, msg_type: 'error' });
    }

    try {
        const result = await userModel.checkExistingUser(username, email);

        if (result.isExistingUsername) {
            return res.status(400).render('register', { msg: `Username already taken`, msg_type: 'error' });
        }

        if (result.isExistingEmail) {
            return res.status(400).render('register', { msg: `Email id already taken`, msg_type: 'error' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.registerUser(username, email, hashedPassword);
        return res.render('register', { msg: 'User Registration Success', msg_type: 'success'});
    }
    catch (error) {
        console.error(error);
    }

};



exports.logout = async (req, res) => {
    res.cookie('account', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect('/');
}

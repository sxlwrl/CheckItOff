const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {database} = require('../database/database');

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

exports.generateToken = async (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.getUser = async (data) => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM users WHERE username=? OR email=?', [data, data], (error, result) => {
            error ? reject(error) : resolve(result[0]);
        });
    });
};

exports.checkExistingUser = (username, email) => {
    return new Promise((resolve, reject) => {
        database.query('SELECT username, email FROM users WHERE username=? OR email=?', [username, email], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                const isExistingUsername = result.find(element => element.username === username);
                const isExistingEmail = result.find(element => element.email === email);
                resolve({ isExistingUsername, isExistingEmail });
            }
        });
    });
};

exports.registerUser = (username, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        database.query('INSERT INTO users SET ?', {username: username, email: email, pass: hashedPassword}, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
};

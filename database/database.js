'use strict';

const mysql = require("mysql");
const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

database.connect((err) => {
    err ? console.log(err) : console.log('MySQL Connection Success');
});

exports.database = database;